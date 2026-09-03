'use client';

import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chat-store';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nexa-violet/10">
        <MessageSquare className="size-7 text-nexa-violet/60" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium text-foreground">Start a conversation</p>
        <p className="text-sm text-muted-foreground">
          Ask Nexa anything — research, code, writing, analysis…
        </p>
      </div>
    </div>
  );
}

// ── Top fade overlay ───────────────────────────────────────────────────────
function TopFade() {
  return (
    <div
      className="pointer-events-none sticky top-0 z-10 h-8 w-full bg-gradient-to-b from-background to-transparent"
      aria-hidden="true"
    />
  );
}

// ── MessageList ────────────────────────────────────────────────────────────
interface MessageListProps {
  conversationId: string;
  className?: string;
}

export function MessageList({ conversationId, className }: MessageListProps) {
  const { messages, isStreaming, sendMessage, deleteMessage } = useChatStore();
  const conversationMessages = messages[conversationId] ?? [];

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track whether user has scrolled up to avoid forcing scroll
  const [userScrolledUp, setUserScrolledUp] = React.useState(false);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (!userScrolledUp) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages.length, userScrolledUp]);

  // Also scroll during streaming (content grows)
  React.useEffect(() => {
    if (isStreaming && !userScrolledUp) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [isStreaming, userScrolledUp]);

  // Detect if user scrolls up
  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setUserScrolledUp(!atBottom);
  }

  async function handleRegenerate(conversationId: string, content: string) {
    await sendMessage(conversationId, content);
  }

  if (conversationMessages.length === 0 && !isStreaming) {
    return <EmptyState />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'relative flex flex-1 flex-col overflow-y-auto',
        className,
      )}
      role="log"
      aria-live="polite"
      aria-label="Conversation messages"
    >
      <TopFade />

      {/* Messages */}
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-4">
        {conversationMessages.map((message, index) => {
          // Find the preceding user message for regeneration context
          const prevUserMessage =
            message.role === 'assistant'
              ? conversationMessages.slice(0, index).reverse().find((m) => m.role === 'user')
              : undefined;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              onDelete={() => deleteMessage(conversationId, message.id)}
              onRegenerate={
                prevUserMessage
                  ? () => void handleRegenerate(conversationId, prevUserMessage.content)
                  : undefined
              }
            />
          );
        })}

        {/* Typing indicator when streaming starts but no assistant message yet */}
        {isStreaming &&
          conversationMessages[conversationMessages.length - 1]?.role !== 'assistant' && (
            <TypingIndicator />
          )}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-px" aria-hidden="true" />
      </div>

      {/* Scroll-to-bottom button when user has scrolled up */}
      {userScrolledUp && (
        <button
          type="button"
          onClick={() => {
            setUserScrolledUp(false);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'absolute bottom-4 left-1/2 -translate-x-1/2 z-20',
            'flex items-center gap-1.5 rounded-full border border-border bg-background/90',
            'px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm',
            'hover:text-foreground transition-colors duration-150 animate-fade-in',
          )}
          aria-label="Scroll to bottom"
        >
          ↓ Jump to bottom
        </button>
      )}
    </div>
  );
}
