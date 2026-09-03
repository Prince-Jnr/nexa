'use client';

import * as React from 'react';
import { ArrowUp, Paperclip, Mic, Search, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chat-store';
import { useAppStore } from '@/stores/app-store';
import { NEXA_MODELS } from '@/config';

// ── Constants ──────────────────────────────────────────────────────────────
/** Maximum visible rows before the textarea scrolls */
const MAX_ROWS = 6;
const LINE_HEIGHT_PX = 24; // ~1.5rem at 16px base

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

// ── Types ──────────────────────────────────────────────────────────────────
interface ComposerProps {
  conversationId: string;
  onSend?: (content: string) => void;
}

// ── Composer ──────────────────────────────────────────────────────────────
export function Composer({ conversationId, onSend }: ComposerProps) {
  const { sendMessage, stopStreaming, isStreaming } = useChatStore();
  const { selectedModel } = useAppStore();

  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchActive, setSearchActive] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const [isListening, setIsListening] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  const currentModel = NEXA_MODELS.find((m) => m.id === selectedModel);
  const canSend = value.trim().length > 0 && !isStreaming;

  // ── Auto-resize ──────────────────────────────────────────────────────────
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = MAX_ROWS * LINE_HEIGHT_PX;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value]);

  React.useEffect(() => () => recognitionRef.current?.stop(), []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleSend() {
    const fileContext = attachedFiles.length > 0
      ? `\n\nAttached files: ${attachedFiles.map((file) => file.name).join(', ')}`
      : '';
    const searchContext = searchActive ? '\n\n[Web search requested]' : '';
    const content = `${value.trim()}${fileContext}${searchContext}`;
    if (!content || isStreaming) return;
    setValue('');
    setAttachedFiles([]);
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSend?.(content);
    await sendMessage(conversationId, content);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleFileAttach() {
    fileInputRef.current?.click();
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    setAttachedFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function toggleVoice() {
    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognitionAPI = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
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

  return (
    <div className="w-full px-4 pb-4 pt-2">
      <div
        className={cn(
          'relative rounded-2xl border bg-background shadow-sm transition-all duration-200',
          isFocused
            ? 'border-nexa-violet/50 shadow-nexa-violet/10 shadow-md ring-2 ring-nexa-violet/20'
            : 'border-border',
          isStreaming && 'border-nexa-violet/30',
        )}
        role="region"
        aria-label="Message composer"
      >
        {/* ── Search mode indicator ── */}
        {searchActive && (
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <Search className="size-3.5 text-nexa-violet" aria-hidden="true" />
            <span className="text-xs text-nexa-violet font-medium">Web search enabled</span>
            <button
              type="button"
              onClick={() => setSearchActive(false)}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              aria-label="Disable web search"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Textarea ── */}
        <div className="flex items-end gap-2 px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message Sad..."
            rows={1}
            aria-label="Message input"
            aria-multiline="true"
            disabled={isStreaming && false /* allow typing while streaming */}
            className={cn(
              'flex-1 resize-none bg-transparent text-[0.9375rem] text-foreground',
              'placeholder:text-muted-foreground outline-none leading-6',
              'min-h-[24px] transition-all duration-150',
            )}
          />

          {/* ── Send / Stop button ── */}
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                'bg-foreground text-background hover:opacity-90 transition-all duration-150',
              )}
              aria-label="Stop generating"
            >
              <Square className="size-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!canSend}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150',
                canSend
                  ? 'bg-nexa-violet text-white shadow-sm hover:opacity-90 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
              )}
              aria-label="Send message"
              aria-disabled={!canSend}
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>

        {/* ── Bottom toolbar ── */}
        <div className="flex items-center gap-1 px-3 pb-3 pt-0">
          {/* Attach */}
          <ToolbarButton
            icon={<Paperclip className="size-3.5" />}
            label="Attach file"
            onClick={handleFileAttach}
          />
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />

          {/* Mic */}
          <ToolbarButton
            icon={<Mic className="size-3.5" />}
            label="Voice input"
            onClick={toggleVoice}
            active={isListening}
          />

          {/* Search toggle */}
          <ToolbarButton
            icon={<Search className="size-3.5" />}
            label={searchActive ? 'Disable web search' : 'Enable web search'}
            onClick={() => setSearchActive((v) => !v)}
            active={searchActive}
          />

          {/* Spacer */}
          <div className="flex-1" aria-hidden="true" />

          {/* Model badge */}
          {currentModel && (
            <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground select-none">
              <span aria-hidden="true">{currentModel.icon}</span>
              <span>{currentModel.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      <p className="mt-1.5 text-center text-[11px] text-muted-foreground/60" aria-hidden="true">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
}

// ── Toolbar button helper ──────────────────────────────────────────────────
interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({ icon, label, onClick, active, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground',
        'hover:bg-accent hover:text-foreground transition-colors duration-150',
        'disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-nexa-violet/10 text-nexa-violet',
      )}
    >
      {icon}
    </button>
  );
}
