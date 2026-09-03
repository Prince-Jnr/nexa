'use client';

import { use, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Edit2,
  Globe,
  Lock,
  Send,
  Sparkles,
  Bot,
  AlertCircle,
  Loader2,
  StopCircle,
  User,
  Wrench,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea as UITextarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_ASSISTANTS } from '@/lib/mock/data';
import { NEXA_MODELS } from '@/config';
import { cn, generateId } from '@/lib/utils';
import type { Assistant } from '@/types';

// ─── Local message type ────────────────────────────────────────────────────────

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// ─── 404 ─────────────────────────────────────────────────────────────────────

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Assistant not found</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        This assistant doesn't exist or may have been deleted.
      </p>
      <Button variant="outline" onClick={() => router.push('/app/assistants')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Assistants
      </Button>
    </div>
  );
}

// ─── Edit dialog ──────────────────────────────────────────────────────────────

function EditAssistantDialog({
  assistant,
  open,
  onClose,
}: {
  assistant: Assistant;
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: assistant.name,
    description: assistant.description,
    avatar: assistant.avatar,
    instructions: assistant.instructions,
    model: assistant.model,
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-nexa-violet" />
            Edit Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nexa-violet/10 to-indigo-500/10 border border-border/50 flex items-center justify-center text-4xl">
              {form.avatar}
            </div>
            <div className="flex-1">
              <Label className="text-xs font-medium mb-1.5 block" htmlFor="edit-name">
                Name
              </Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block" htmlFor="edit-desc">
              Description
            </Label>
            <Input
              id="edit-desc"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Model</Label>
            <Select value={form.model} onValueChange={(v) => update('model', v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NEXA_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-sm">
                    <span className="flex items-center gap-2">
                      <span>{m.icon}</span>
                      <span>{m.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block" htmlFor="edit-instructions">
              Instructions
            </Label>
            <UITextarea
              id="edit-instructions"
              value={form.instructions}
              onChange={(e) => update('instructions', e.target.value)}
              className="text-sm min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-nexa-violet hover:bg-nexa-violet/90 text-white"
            onClick={onClose}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, assistant }: { msg: LocalMessage; assistant: Assistant }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex gap-3 max-w-3xl', isUser && 'flex-row-reverse ml-auto')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-sm mt-0.5',
          isUser
            ? 'bg-nexa-violet/10 text-nexa-violet'
            : 'bg-gradient-to-br from-nexa-violet/10 to-indigo-500/10 border border-border/50'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : assistant.avatar}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[80%]',
          isUser
            ? 'bg-nexa-violet text-white rounded-tr-sm'
            : 'bg-muted/50 text-foreground border border-border/50 rounded-tl-sm'
        )}
      >
        {msg.isStreaming ? (
          <span className="flex items-center gap-2">
            <span className="whitespace-pre-wrap">{msg.content}</span>
            <span className="w-1.5 h-4 bg-current rounded-full animate-pulse opacity-70" />
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{msg.content}</span>
        )}
      </div>
    </div>
  );
}

// ─── Conversation starters ────────────────────────────────────────────────────

function ConversationStarters({
  starters,
  onSelect,
}: {
  starters: string[];
  onSelect: (starter: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-12 px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">How can I help you today?</p>
        <p className="text-xs text-muted-foreground mt-1">Select a starter or type your own message</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {starters.map((starter) => (
          <button
            key={starter}
            className="text-left text-xs px-4 py-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground transition-all leading-relaxed"
            onClick={() => onSelect(starter)}
          >
            <Sparkles className="h-3.5 w-3.5 inline-block mr-1.5 text-nexa-violet opacity-60" />
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MOCK_AI_REPLIES: string[] = [
  "I'd be happy to help with that! Let me think through this carefully and give you a thorough response.",
  "Great question! Here's my analysis based on my expertise in this area.",
  "Absolutely, let me break that down for you in a clear and structured way.",
  "That's an interesting challenge. Here's how I'd approach it given my specialization.",
];

export default function AssistantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const assistant = MOCK_ASSISTANTS.find((a) => a.id === id);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!assistant) return <NotFound />;

  const model = NEXA_MODELS.find((m) => m.id === assistant.model);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: LocalMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Simulate streaming response
    const replyText =
      MOCK_AI_REPLIES[Math.floor(Math.random() * MOCK_AI_REPLIES.length)];
    const assistantMsgId = generateId();
    const assistantMsg: LocalMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    const words = replyText.split(' ');
    let built = '';
    for (let i = 0; i < words.length; i++) {
      await new Promise((res) => setTimeout(res, 40 + Math.random() * 30));
      built += (i > 0 ? ' ' : '') + words[i];
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, content: built } : m))
      );
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantMsgId ? { ...m, isStreaming: false } : m))
    );
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left info panel */}
      <div className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-border bg-muted/10 overflow-auto shrink-0">
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={() => router.push('/app/assistants')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">Back</span>
          </div>

          {/* Avatar + identity */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-nexa-violet/10 to-indigo-500/10 border border-border/50 flex items-center justify-center text-5xl mx-auto mb-3">
              {assistant.avatar}
            </div>
            <h2 className="font-bold text-foreground text-base">{assistant.name}</h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed px-2">
              {assistant.description}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {assistant.isPublic ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Globe className="h-2.5 w-2.5" />
                  Public
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                  <Lock className="h-2.5 w-2.5" />
                  Private
                </span>
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Model */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Model
            </h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border/50">
              <span className="text-base">{model?.icon ?? '✦'}</span>
              <div>
                <p className="text-xs font-medium text-foreground">{model?.name ?? assistant.model}</p>
                <p className="text-[11px] text-muted-foreground">{model?.description}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Capabilities */}
          {assistant.capabilities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">
                Capabilities
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {assistant.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-nexa-violet/10 text-nexa-violet border border-nexa-violet/20"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {assistant.tools.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {assistant.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/50 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border/50" />

          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setEditOpen(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Assistant
          </Button>
        </div>
      </div>

      {/* Right conversation area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header (mobile) */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => router.push('/app/assistants')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nexa-violet/10 to-indigo-500/10 border border-border/50 flex items-center justify-center text-xl">
            {assistant.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{assistant.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setEditOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto">
          {messages.length === 0 ? (
            <ConversationStarters
              starters={assistant.conversationStarters}
              onSelect={(s) => {
                setInput(s);
                textareaRef.current?.focus();
              }}
            />
          ) : (
            <div className="px-4 py-6 space-y-5 max-w-3xl mx-auto w-full">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} assistant={assistant} />
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-muted/30 rounded-2xl border border-border/60 focus-within:border-nexa-violet/40 focus-within:bg-background transition-all px-4 py-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${assistant.name}…`}
                className="flex-1 bg-transparent border-0 resize-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[36px] max-h-[160px] p-0 leading-relaxed placeholder:text-muted-foreground/50"
                rows={1}
              />
              {isStreaming ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => setIsStreaming(false)}
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-xl shrink-0 transition-all',
                    input.trim()
                      ? 'bg-nexa-violet hover:bg-nexa-violet/90 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                  disabled={!input.trim()}
                  onClick={() => sendMessage(input)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/50 text-center mt-2">
              ↵ to send · Shift+↵ for new line
            </p>
          </div>
        </div>
      </div>

      <EditAssistantDialog
        assistant={assistant}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
