'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Home, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chat-store';
import { NEXA_MODELS } from '@/config';
import { MessageList } from '@/components/chat/message-list';
import { Composer } from '@/components/chat/composer';

// ── Model badge colour ─────────────────────────────────────────────────────
function modelBadgeStyle(modelId: string): string {
  const map: Record<string, string> = {
    'nexa-fast': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'nexa-pro': 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    'nexa-vision': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    'nexa-research': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    'nexa-code': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'nexa-creative': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  };
  return map[modelId] ?? 'bg-muted text-muted-foreground';
}

// ── 404 / Not-found state ─────────────────────────────────────────────────
function NotFoundState() {
  const router = useRouter();
  const { createConversation } = useChatStore();

  function handleNewChat() {
    const id = createConversation();
    router.push(`/app/chat/${id}`);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-20 text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <AlertCircle className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-xs">
        <h2 className="text-lg font-semibold text-foreground">Conversation not found</h2>
        <p className="text-sm text-muted-foreground">
          This conversation doesn&apos;t exist or may have been deleted.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNewChat}
          className={cn(
            'flex items-center gap-2 rounded-xl bg-nexa-violet px-4 py-2.5',
            'text-sm font-medium text-white hover:opacity-90 transition-opacity',
          )}
          aria-label="Start a new conversation"
        >
          <MessageSquarePlus className="size-4" />
          New conversation
        </button>
        <Link
          href="/app"
          className={cn(
            'flex items-center gap-2 rounded-xl border border-border px-4 py-2.5',
            'text-sm font-medium text-foreground hover:bg-accent transition-colors',
          )}
          aria-label="Go to home"
        >
          <Home className="size-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}

// ── Breadcrumb bar ─────────────────────────────────────────────────────────
interface BreadcrumbBarProps {
  title: string;
  model: string;
}

function BreadcrumbBar({ title, model }: BreadcrumbBarProps) {
  const modelDef = NEXA_MODELS.find((m) => m.id === model);

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b border-border bg-background/80 px-4 py-2.5',
        'backdrop-blur-sm z-10 min-h-[44px]',
      )}
      role="navigation"
      aria-label="Conversation breadcrumb"
    >
      <Link
        href="/app"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Home"
      >
        Home
      </Link>
      <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />
      <Link
        href="/app/chats"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="All chats"
      >
        Chats
      </Link>
      <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />

      {/* Conversation title */}
      <span
        className="flex-1 truncate text-xs font-medium text-foreground"
        aria-current="page"
        title={title}
      >
        {title}
      </span>

      {/* Model badge */}
      {modelDef && (
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border border-transparent',
            modelBadgeStyle(modelDef.id),
          )}
          aria-label={`Using ${modelDef.name}`}
        >
          {modelDef.icon} {modelDef.name}
        </span>
      )}
    </div>
  );
}

// ── Chat Page ──────────────────────────────────────────────────────────────
export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { conversations, setActiveConversation } = useChatStore();
  const conversation = conversations.find((c) => c.id === id);

  // Activate this conversation in the store on mount / id change
  React.useEffect(() => {
    setActiveConversation(id ?? null);
    return () => {
      // Optionally clear active conversation on unmount
      // setActiveConversation(null);
    };
  }, [id, setActiveConversation]);

  // Render not-found state if conversation doesn't exist
  if (!id || !conversation) {
    return (
      <div className="flex h-full flex-col">
        <NotFoundState />
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      aria-label={`Conversation: ${conversation.title}`}
    >
      {/* ── Breadcrumb bar ── */}
      <BreadcrumbBar title={conversation.title} model={conversation.model} />

      {/* ── Message list (scrollable middle) ── */}
      <MessageList
        conversationId={id}
        className="flex-1"
      />

      {/* ── Composer (sticky bottom) ── */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm">
        <Composer conversationId={id} />
      </div>
    </div>
  );
}
