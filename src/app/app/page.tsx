'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  Paperclip,
  Search,
  FlaskConical,
  Image,
  FolderOpen,
  Mic,
  MessageSquare,
  FolderKanban,
  ChevronRight,
  Microscope,
  ScanSearch,
  Code2,
  Bot,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn, getGreeting, formatDate, truncate } from '@/lib/utils';
import { QUICK_ACTIONS, NEXA_MODELS } from '@/config';
import { useChatStore } from '@/stores/chat-store';
import { useAppStore } from '@/stores/app-store';
import { MOCK_PROJECTS, MOCK_USAGE } from '@/lib/mock/data';

// ── Icon map for QUICK_ACTIONS ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Microscope,
  ScanSearch,
  Image,
  Code2,
  Bot,
  Zap,
  FlaskConical,
};

// ── Action pills config ────────────────────────────────────────────────────
const ACTION_PILLS = [
  { id: 'attach', label: 'Attach', icon: Paperclip },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'research', label: 'Research', icon: FlaskConical },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'file', label: 'File', icon: FolderOpen },
  { id: 'voice', label: 'Voice', icon: Mic },
] as const;

type SpeechRecognitionResultEventLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

// ── Model badge color helper ───────────────────────────────────────────────
function modelColor(modelId: string): string {
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

// ── Hero Composer ──────────────────────────────────────────────────────────
function HeroComposer() {
  const router = useRouter();
  const { createConversation, sendMessage } = useChatStore();
  const { selectedModel } = useAppStore();
  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchActive, setSearchActive] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const [isListening, setIsListening] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const fileContext = attachedFiles.length > 0
      ? `\n\nAttached files: ${attachedFiles.map((file) => file.name).join(', ')}`
      : '';
    const searchContext = searchActive ? '\n\n[Web search requested]' : '';
    const id = createConversation(trimmed.slice(0, 60), selectedModel);
    // Fire the message into the new conversation, then navigate.
    // sendMessage is async (streams) — we intentionally don't await it here
    // so navigation happens immediately and the chat page picks up the stream.
    void sendMessage(id, `${trimmed}${fileContext}${searchContext}`);
    router.push(`/app/chat/${id}`);
    setValue('');
    setAttachedFiles([]);
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    setAttachedFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function toggleVoice() {
    const SpeechRecognitionAPI = (window as SpeechRecognitionWindow).SpeechRecognition ?? (window as SpeechRecognitionWindow).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setValue((current) => `${current}${current ? ' ' : ''}(Voice input is not supported in this browser.)`);
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => setValue((current) => `${current}${current ? ' ' : ''}${event.results[0][0].transcript}`);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  React.useEffect(() => () => recognitionRef.current?.stop(), []);

  const currentModel = NEXA_MODELS.find((m) => m.id === selectedModel);

  return (
    <div
      className={cn(
        'w-full rounded-2xl border bg-background shadow-md transition-all duration-200',
        isFocused
          ? 'border-nexa-violet/60 shadow-nexa-violet/10 shadow-lg ring-2 ring-nexa-violet/20'
          : 'border-border',
      )}
    >
      {/* Textarea row */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Sad anything..."
          rows={1}
          aria-label="Ask Nexa anything"
          className={cn(
            'flex-1 resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground',
            'outline-none leading-relaxed min-h-[28px] max-h-[120px] overflow-y-auto',
          )}
        />
        <Button
          size="icon"
          variant={value.trim() ? 'nexa' : 'ghost'}
          className={cn(
            'mt-0.5 shrink-0 rounded-xl transition-all duration-200',
            !value.trim() && 'opacity-40 cursor-not-allowed',
          )}
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Send message"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      {/* Action pills + model badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-3 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {ACTION_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={cn(
                'flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1',
                'text-xs font-medium text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground hover:border-nexa-violet/30',
              )}
              aria-label={pill.label}
              aria-pressed={pill.id === 'search' ? searchActive : undefined}
              onClick={() => {
                if (pill.id === 'attach' || pill.id === 'file') fileInputRef.current?.click();
                if (pill.id === 'search') setSearchActive((active) => !active);
                if (pill.id === 'research') router.push('/app/research');
                if (pill.id === 'image') router.push('/app/discover');
                if (pill.id === 'voice') toggleVoice();
              }}
              data-active={pill.id === 'search' ? searchActive : pill.id === 'voice' ? isListening : undefined}
            >
              <pill.icon className="size-3" />
              {pill.label}
            </button>
          ))}
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
          {attachedFiles.length > 0 && <span className="text-xs text-nexa-violet">{attachedFiles.length} file{attachedFiles.length === 1 ? '' : 's'} attached</span>}
        </div>
        {currentModel && (
          <span
            className={cn(
              'rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
              modelColor(currentModel.id),
            )}
          >
            {currentModel.icon} {currentModel.name}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Quick Actions Grid ─────────────────────────────────────────────────────
function QuickActionsGrid() {
  const router = useRouter();
  const { createConversation, sendMessage } = useChatStore();

  function handleActionClick(action: (typeof QUICK_ACTIONS)[number]) {
    if (action.id === 'research') {
      router.push('/app/research');
    } else if (action.id === 'assistants') {
      router.push('/app/assistants');
    } else if (action.id === 'image') {
      router.push('/app/discover');
    } else {
      const id = createConversation(action.label);
      void sendMessage(id, action.description);
      router.push(`/app/chat/${id}`);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {QUICK_ACTIONS.map((action) => {
        const Icon = ICON_MAP[action.icon] ?? MessageSquare;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => handleActionClick(action)}
            className={cn(
              'group relative flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left',
              'bg-gradient-to-br transition-all duration-200',
              action.color,
              'hover:border-nexa-violet/30 hover:shadow-md hover:scale-[1.01]',
            )}
            aria-label={action.label}
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4 shrink-0" />
              <span className="text-sm font-semibold text-foreground">{action.label}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}

// ── Recent Conversations ───────────────────────────────────────────────────
function RecentConversations() {
  const { getRecentConversations } = useChatStore();
  const recent = getRecentConversations().slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <MessageSquare className="mb-2 size-8 opacity-30" />
        <p className="text-sm">No recent conversations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-px">
      {recent.map((conv) => (
        <Link
          key={conv.id}
          href={`/app/chat/${conv.id}`}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5',
            'hover:bg-accent/60 transition-colors duration-150',
          )}
          aria-label={`Open conversation: ${conv.title}`}
        >
          <MessageSquare className="size-4 shrink-0 text-muted-foreground/60" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
            {conv.lastMessage && (
              <p className="text-xs text-muted-foreground truncate">
                {truncate(conv.lastMessage, 60)}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                'hidden sm:inline-flex rounded-full px-2 py-0.5 text-xs font-medium border border-transparent',
                modelColor(conv.model),
              )}
            >
              {NEXA_MODELS.find((m) => m.id === conv.model)?.name ?? conv.model}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(conv.updatedAt)}
            </span>
            <span className="text-xs text-muted-foreground">
              {conv.messageCount} msgs
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Projects Section ───────────────────────────────────────────────────────
function ProjectsSection() {
  const projects = MOCK_PROJECTS.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/app/projects`}
          className={cn(
            'group flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4',
            'hover:border-nexa-violet/30 hover:shadow-sm hover:scale-[1.005] transition-all duration-200',
          )}
          aria-label={`Open project: ${project.name}`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
              style={{ backgroundColor: `${project.color}20`, color: project.color }}
            >
              {project.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center gap-3 mt-auto pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              {project.conversationCount} chats
            </span>
            <span className="flex items-center gap-1">
              <FolderOpen className="size-3" />
              {project.fileCount} files
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Usage Overview ─────────────────────────────────────────────────────────
function UsageOverview() {
  const usage = MOCK_USAGE;

  const stats = [
    {
      label: 'Messages',
      used: usage.messages.used,
      limit: usage.messages.limit,
      format: (v: number) => v.toLocaleString(),
      unit: '',
    },
    {
      label: 'Storage',
      used: usage.storage.used,
      limit: usage.storage.limit,
      format: (v: number) => `${v} GB`,
      unit: 'GB',
    },
    {
      label: 'Research',
      used: usage.research.used,
      limit: usage.research.limit,
      format: (v: number) => v.toString(),
      unit: 'jobs',
    },
    {
      label: 'Image gen',
      used: usage.imageGen.used,
      limit: usage.imageGen.limit,
      format: (v: number) => v.toString(),
      unit: 'images',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => {
        const pct = Math.min(100, Math.round((stat.used / stat.limit) * 100));
        const isHigh = pct >= 80;
        const isMed = pct >= 50 && pct < 80;
        return (
          <div key={stat.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{stat.label}</span>
              <span
                className={cn(
                  'font-semibold',
                  isHigh
                    ? 'text-destructive'
                    : isMed
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-foreground',
                )}
              >
                {pct}%
              </span>
            </div>
            <Progress
              value={pct}
              className={cn(
                'h-1.5',
                isHigh && '[&>[data-slot=indicator]]:bg-destructive',
                isMed && '[&>[data-slot=indicator]]:bg-amber-500',
              )}
            />
            <p className="text-xs text-muted-foreground">
              {stat.format(stat.used)} / {stat.format(stat.limit)}
              {stat.unit ? ` ${stat.unit}` : ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({
  title,
  viewAllHref,
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-foreground tracking-tight">{title}</h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-0.5 text-xs text-nexa-violet hover:underline transition-opacity"
          aria-label={`View all ${title}`}
        >
          View all <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
export default function AppHomePage() {
  const { user } = useAppStore();
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const greeting = getGreeting();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-[860px] px-6 py-8 space-y-10">

        {/* ── Hero Greeting ── */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {greeting}, {firstName}.
          </h1>
          <p className="text-base text-muted-foreground">What are we working on?</p>
        </div>

        {/* ── Hero Composer ── */}
        <HeroComposer />

        {/* ── Quick Actions ── */}
        <section aria-labelledby="quick-actions-heading">
          <SectionHeader title="Quick Actions" />
          <QuickActionsGrid />
        </section>

        {/* ── Recent Conversations ── */}
        <section aria-labelledby="recent-convs-heading">
          <SectionHeader title="Recent Conversations" viewAllHref="/app/chats" />
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <RecentConversations />
          </div>
        </section>

        {/* ── Projects ── */}
        <section aria-labelledby="projects-heading">
          <SectionHeader title="Projects" viewAllHref="/app/projects" />
          <ProjectsSection />
        </section>

        {/* ── Usage Overview ── */}
        <section aria-labelledby="usage-heading">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Usage this month</h2>
              <Link href="/app/billing" className="text-xs text-nexa-violet hover:underline">
                Manage plan
              </Link>
            </div>
            <UsageOverview />
          </div>
        </section>

      </div>
    </div>
  );
}
