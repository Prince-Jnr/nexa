'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Pencil,
} from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { NEXA_MODELS } from '@/config';
import type { Message } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// ── Code block renderer ────────────────────────────────────────────────────
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function CodeBlock({ inline, className, children }: CodeProps) {
  const isInline = inline ?? !className;
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className ?? '');
  const language = match ? match[1] : 'text';
  const code = String(children ?? '').replace(/\n$/, '');

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isInline) {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem]">
        {children}
      </code>
    );
  }

  return (
    <div className="group/code relative my-3 overflow-hidden rounded-xl border border-border bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-white/50">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 hover:text-white/80 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.8125rem',
          lineHeight: '1.6',
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono), monospace' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Streaming cursor ───────────────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-4 w-0.5 animate-pulse-soft rounded-full bg-nexa-violet align-middle"
    />
  );
}

// ── User Bubble ────────────────────────────────────────────────────────────
interface UserBubbleProps {
  message: Message;
}

function UserBubble({ message }: UserBubbleProps) {
  const { user } = useAppStore();
  const [showEdit, setShowEdit] = React.useState(false);
  const initials = getInitials(user?.name ?? 'U');

  return (
    <div
      className="group flex items-start justify-end gap-3"
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
      role="article"
      aria-label="Your message"
    >
      {/* Edit button (hover) */}
      <div
        className={cn(
          'mt-2 transition-opacity duration-150',
          showEdit ? 'opacity-100' : 'opacity-0',
        )}
      >
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Edit message"
        >
          <Pencil className="size-3.5" />
        </button>
      </div>

      {/* Bubble */}
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        <div className="rounded-2xl rounded-tr-sm bg-nexa-violet/10 px-4 py-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap border border-nexa-violet/20">
          {message.content}
        </div>
        <time
          className="text-xs text-muted-foreground"
          dateTime={message.createdAt}
          aria-label={`Sent at ${formatDate(message.createdAt)}`}
        >
          {formatDate(message.createdAt)}
        </time>
      </div>

      {/* Avatar */}
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nexa-violet/20 text-xs font-semibold text-nexa-violet select-none"
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  );
}

// ── Assistant Bubble ───────────────────────────────────────────────────────
interface AssistantBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

function AssistantBubble({ message, onRegenerate, onDelete }: AssistantBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const [liked, setLiked] = React.useState<'up' | 'down' | null>(null);
  const [showActions, setShowActions] = React.useState(false);

  const model = NEXA_MODELS.find((m) => m.id === message.model);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="group flex items-start gap-3"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="article"
      aria-label="Assistant message"
    >
      {/* Model avatar */}
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nexa-violet/10 text-sm select-none"
        aria-hidden="true"
      >
        {model?.icon ?? '✦'}
      </div>

      <div className="flex-1 min-w-0">
        {/* Model badge */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{model?.name ?? 'Sad'}</span>
          {model && (
            <span className="rounded-full bg-nexa-violet/10 px-2 py-0.5 text-xs text-nexa-violet">
              {model.category}
            </span>
          )}
          <time
            className="text-xs text-muted-foreground"
            dateTime={message.createdAt}
            aria-label={`Responded at ${formatDate(message.createdAt)}`}
          >
            {formatDate(message.createdAt)}
          </time>
        </div>

        {/* Content */}
        <div className="nexa-prose text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: (props: any) => <CodeBlock {...props} />,
              // Open links in new tab safely
              a: ({ href, children, ...rest }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...rest}
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
          {message.isStreaming && <StreamingCursor />}
        </div>

        {/* Action bar (appears on hover, hidden during streaming) */}
        {!message.isStreaming && (
          <div
            className={cn(
              'mt-3 flex items-center gap-0.5 transition-all duration-150',
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none',
            )}
            role="toolbar"
            aria-label="Message actions"
          >
            {/* Copy */}
            <ActionButton
              onClick={handleCopy}
              icon={copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              label="Copy message"
              tooltip={copied ? 'Copied!' : 'Copy'}
            />

            {/* Regenerate */}
            <ActionButton
              onClick={onRegenerate}
              icon={<RefreshCw className="size-3.5" />}
              label="Regenerate response"
              tooltip="Regenerate"
            />

            {/* Divider */}
            <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

            {/* Thumbs up */}
            <ActionButton
              onClick={() => setLiked((p) => (p === 'up' ? null : 'up'))}
              icon={
                <ThumbsUp
                  className={cn('size-3.5', liked === 'up' && 'fill-nexa-violet text-nexa-violet')}
                />
              }
              label="Helpful"
              tooltip="Helpful"
              active={liked === 'up'}
            />

            {/* Thumbs down */}
            <ActionButton
              onClick={() => setLiked((p) => (p === 'down' ? null : 'down'))}
              icon={
                <ThumbsDown
                  className={cn(
                    'size-3.5',
                    liked === 'down' && 'fill-destructive text-destructive',
                  )}
                />
              }
              label="Not helpful"
              tooltip="Not helpful"
              active={liked === 'down'}
            />

            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" title="More" aria-label="More options" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150">
                  <MoreHorizontal className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={4}>
                <DropdownMenuItem onSelect={() => void handleCopy()}>Copy message</DropdownMenuItem>
                {onRegenerate && <DropdownMenuItem onSelect={onRegenerate}>Regenerate response</DropdownMenuItem>}
                {onDelete && <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">Delete message</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Action Button helper ───────────────────────────────────────────────────
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  onClick?: () => void;
  active?: boolean;
}

function ActionButton({ icon, label, tooltip, onClick, active }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      aria-label={label}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground',
        'hover:bg-accent hover:text-foreground transition-colors duration-150',
        active && 'text-nexa-violet bg-nexa-violet/10',
      )}
    >
      {icon}
    </button>
  );
}

// ── MessageBubble (main export) ────────────────────────────────────────────
interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export function MessageBubble({ message, onRegenerate, onDelete }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserBubble message={message} />;
  }

  if (message.role === 'assistant') {
    return <AssistantBubble message={message} onRegenerate={onRegenerate} onDelete={onDelete} />;
  }

  // System messages (hidden from UI but accessible)
  return null;
}
