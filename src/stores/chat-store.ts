import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Conversation, Message } from "@/types";
import { generateId } from "@/lib/utils";

const emptyStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    try {
      const user = JSON.parse(localStorage.getItem("nexa-current-user") ?? "null") as { id?: string } | null;
      return localStorage.getItem(`${name}-${user?.id ?? "signed-out"}`);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return;
    const user = JSON.parse(localStorage.getItem("nexa-current-user") ?? "null") as { id?: string } | null;
    localStorage.setItem(`${name}-${user?.id ?? "signed-out"}`, value);
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return;
    const user = JSON.parse(localStorage.getItem("nexa-current-user") ?? "null") as { id?: string } | null;
    localStorage.removeItem(`${name}-${user?.id ?? "signed-out"}`);
  },
};

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isStreaming: boolean;
  searchQuery: string;

  setActiveConversation: (id: string | null) => void;
  createConversation: (title?: string, model?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  archiveConversation: (id: string) => void;
  setSearchQuery: (query: string) => void;

  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  stopStreaming: () => void;
  deleteMessage: (conversationId: string, messageId: string) => void;

  getFilteredConversations: () => Conversation[];
  getPinnedConversations: () => Conversation[];
  getRecentConversations: () => Conversation[];
}

export const useChatStore = create<ChatState>()(persist((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isStreaming: false,
  searchQuery: "",

  setActiveConversation: (id) => set({ activeConversationId: id }),

  createConversation: (title, model = "nexa-pro") => {
    const id = `conv-${generateId()}`;
    const conversation: Conversation = {
      id,
      title: title || "New conversation",
      model,
      isPinned: false,
      isArchived: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: id,
      messages: { ...state.messages, [id]: [] },
    }));
    return id;
  },

  deleteConversation: (id) => {
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[id];
      return {
        conversations: state.conversations.filter((c) => c.id !== id),
        messages: newMessages,
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      };
    });
  },

  renameConversation: (id, title) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c)),
    }));
  },

  togglePin: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
    }));
  },

  archiveConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c)),
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  sendMessage: async (conversationId, content) => {
    const userMessage: Message = {
      id: `msg-${generateId()}`,
      conversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    // Append user message and set streaming flag
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), userMessage],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messageCount: c.messageCount + 1, updatedAt: new Date().toISOString(), lastMessage: content }
          : c
      ),
      isStreaming: true,
    }));

    const assistantMessageId = `msg-${generateId()}`;
    const conversationModel = get().conversations.find((c) => c.id === conversationId)?.model ?? "nexa-pro";
    const assistantMessage: Message = {
      id: assistantMessageId,
      conversationId,
      role: "assistant",
      content: "",
      model: conversationModel,
      isStreaming: true,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), assistantMessage],
      },
    }));

    try {
      // Build the messages array in OpenAI format from conversation history
      const allMessages = get().messages[conversationId] || [];
      const apiMessages = allMessages
        .filter((m) => m.id !== assistantMessageId)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      // Get the active model from the conversation
      const conversation = get().conversations.find((c) => c.id === conversationId);
      const model = conversation?.model ?? "nexa-pro";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model }),
      });

      if (!response.ok) {
        // Try to parse a meaningful error from the API response
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          errorDetail = errBody.error ?? errorDetail;
        } catch { /* ignore */ }
        throw new Error(errorDetail);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let pending = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Stop if the user hit the stop button
        if (!get().isStreaming) {
          reader.cancel();
          break;
        }

        pending += decoder.decode(value, { stream: true });
        const lines = pending.split("\n");
        pending = lines.pop() ?? "";

        // Parse AI SDK data stream format: lines prefixed with "0:" are text tokens
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const token = JSON.parse(line.slice(2));
              fullContent += token;
              set((state) => ({
                messages: {
                  ...state.messages,
                  [conversationId]: (state.messages[conversationId] || []).map((m) =>
                    m.id === assistantMessageId ? { ...m, content: fullContent } : m
                  ),
                },
              }));
            } catch {
              // ignore malformed lines
            }
          } else if (line.startsWith("3:")) {
            try {
              throw new Error(JSON.parse(line.slice(2)));
            } catch (error) {
              throw error instanceof Error ? error : new Error("The AI provider returned an error.");
            }
          }
        }
      }

      // Some providers finish without a trailing newline.
      if (pending.startsWith("0:")) {
        try {
          fullContent += JSON.parse(pending.slice(2));
        } catch {
          // Ignore an incomplete final data line.
        }
      } else if (pending.startsWith("3:")) {
        throw new Error(JSON.parse(pending.slice(2)));
      }

      // Finalise
      set((state) => ({
        isStreaming: false,
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((m) =>
            m.id === assistantMessageId ? { ...m, isStreaming: false, content: fullContent } : m
          ),
        },
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, messageCount: c.messageCount + 1, lastMessage: fullContent.slice(0, 100) }
            : c
        ),
      }));
    } catch (error) {
      console.error("Chat API error:", error);
      const errorText = error instanceof Error ? error.message : String(error);
      set((state) => ({
        isStreaming: false,
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  isStreaming: false,
                  content: `⚠️ **Error:** ${errorText}`,
                }
              : m
          ),
        },
      }));
    }
  },

  stopStreaming: () => set({ isStreaming: false }),

  deleteMessage: (conversationId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).filter((m) => m.id !== messageId),
      },
    }));
  },

  getFilteredConversations: () => {
    const { conversations, searchQuery } = get();
    if (!searchQuery) return conversations.filter((c) => !c.isArchived);
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => !c.isArchived && (c.title.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q)));
  },

  getPinnedConversations: () => {
    return get().conversations.filter((c) => c.isPinned && !c.isArchived);
  },

  getRecentConversations: () => {
    return get()
      .conversations.filter((c) => !c.isArchived)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  },
}), {
  name: "nexa-chat-store",
  storage: createJSONStorage(() => emptyStorage),
  skipHydration: true,
  partialize: (state) => ({
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    messages: state.messages,
    searchQuery: state.searchQuery,
  }),
}));
