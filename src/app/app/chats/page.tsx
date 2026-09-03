'use client';

import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';

export default function ChatsPage() {
  const router = useRouter();
  const { conversations } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Conversations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{conversations.length} conversations</p>
        </div>
        <Button variant="nexa" size="sm" onClick={() => router.push('/app')}>
          New Chat
        </Button>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-1">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">No conversations yet. Start a new chat!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => router.push(`/app/chat/${conv.id}`)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate flex-1">{conv.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{formatDate(conv.updatedAt)}</span>
                </div>
                {conv.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
