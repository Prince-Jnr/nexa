'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Plus,
  MessageSquare,
  Edit2,
  MoreHorizontal,
  Globe,
  Lock,
  Sparkles,
  Trash2,
  Copy,
  Inbox,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_ASSISTANTS } from '@/lib/mock/data';
import { NEXA_MODELS } from '@/config';
import { cn } from '@/lib/utils';
import type { Assistant } from '@/types';

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AssistantAvatar({ avatar, size = 'md' }: { avatar: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
  };
  return (
    <div
      className={cn(
        sizeMap[size],
        'rounded-2xl bg-gradient-to-br from-nexa-violet/10 to-indigo-500/10 border border-border/50 flex items-center justify-center'
      )}
    >
      {avatar}
    </div>
  );
}

// ─── Model badge ──────────────────────────────────────────────────────────────

function ModelBadge({ modelId }: { modelId: string }) {
  const model = NEXA_MODELS.find((m) => m.id === modelId);
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-muted/60 text-muted-foreground border-border/50">
      {model?.icon ?? '✦'} {model?.name ?? modelId}
    </span>
  );
}

// ─── Assistant Card ───────────────────────────────────────────────────────────

function AssistantCard({ assistant }: { assistant: Assistant }) {
  const router = useRouter();

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:border-border/80 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <AssistantAvatar avatar={assistant.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">{assistant.name}</h3>
            {assistant.isPublic ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Globe className="h-2.5 w-2.5" />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {assistant.description}
          </p>
        </div>

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => router.push(`/app/assistants/${assistant.id}`)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Model + capabilities */}
      <div className="space-y-2.5">
        <ModelBadge modelId={assistant.model} />
        {assistant.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {assistant.capabilities.slice(0, 3).map((cap) => (
              <span
                key={cap}
                className="text-[11px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/40"
              >
                {cap}
              </span>
            ))}
            {assistant.capabilities.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/40">
                +{assistant.capabilities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Conversation starters */}
      {assistant.conversationStarters.length > 0 && (
        <div className="space-y-1.5">
          {assistant.conversationStarters.slice(0, 2).map((starter) => (
            <button
              key={starter}
              className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground transition-all truncate"
              onClick={() => router.push(`/app/assistants/${assistant.id}`)}
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border/40 mt-auto">
        <Button
          size="sm"
          className="flex-1 h-8 text-xs bg-nexa-violet hover:bg-nexa-violet/90 text-white"
          onClick={() => router.push(`/app/assistants/${assistant.id}`)}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          Start Chat
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => router.push(`/app/assistants/${assistant.id}`)}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Create Assistant Dialog ──────────────────────────────────────────────────

const EMOJI_OPTIONS = ['🤖', '⚛', '📊', '✍', '🧠', '💡', '🔬', '🎨', '💻', '📝', '🌍', '⚡'];

function CreateAssistantDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    avatar: '🤖',
    instructions: '',
    model: 'nexa-pro',
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-nexa-violet" />
            Create Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Avatar picker */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={cn(
                    'w-9 h-9 rounded-xl text-xl flex items-center justify-center border-2 transition-all',
                    form.avatar === emoji
                      ? 'border-nexa-violet bg-nexa-violet/10'
                      : 'border-border/50 hover:border-border bg-muted/30'
                  )}
                  onClick={() => update('avatar', emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" htmlFor="ast-name">
              Name
            </Label>
            <Input
              id="ast-name"
              placeholder="e.g. Frontend Engineer"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" htmlFor="ast-desc">
              Description
            </Label>
            <Input
              id="ast-desc"
              placeholder="What does this assistant do?"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Model */}
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
                      <span className="text-muted-foreground text-xs">— {m.description}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" htmlFor="ast-instructions">
              Instructions
            </Label>
            <Textarea
              id="ast-instructions"
              placeholder="Describe the assistant's role, behavior, and expertise…"
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
            <Sparkles className="h-4 w-4 mr-1.5" />
            Create Assistant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssistantsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const myAssistants = MOCK_ASSISTANTS.filter((a) => !a.isPublic);
  const publicAssistants = MOCK_ASSISTANTS.filter((a) => a.isPublic);
  const allMyAssistants = [...myAssistants, ...MOCK_ASSISTANTS.filter((a) => a.isPublic === false)];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-nexa-violet" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Assistants</h1>
              <p className="text-xs text-muted-foreground">
                {MOCK_ASSISTANTS.length} assistant{MOCK_ASSISTANTS.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-nexa-violet hover:bg-nexa-violet/90 text-white"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Assistant
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="mine" className="h-full flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="bg-muted/40 h-9">
              <TabsTrigger value="mine" className="text-xs px-4">
                My Assistants
                <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {MOCK_ASSISTANTS.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="discover" className="text-xs px-4">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Discover
                <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {publicAssistants.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* My Assistants */}
          <TabsContent value="mine" className="flex-1 overflow-auto mt-0 px-6 pt-4 pb-8">
            {MOCK_ASSISTANTS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Inbox className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  No assistants yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-5">
                  Create custom AI assistants tailored to your workflows.
                </p>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assistant
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {MOCK_ASSISTANTS.map((assistant) => (
                  <AssistantCard key={assistant.id} assistant={assistant} />
                ))}
                {/* Create new card */}
                <button
                  className="group border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-nexa-violet/40 hover:bg-nexa-violet/5 transition-all duration-200 min-h-[200px]"
                  onClick={() => setCreateOpen(true)}
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 group-hover:bg-nexa-violet/10 flex items-center justify-center transition-colors">
                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-nexa-violet transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-nexa-violet transition-colors">
                      Create Assistant
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Custom AI tuned to your needs
                    </p>
                  </div>
                </button>
              </div>
            )}
          </TabsContent>

          {/* Discover */}
          <TabsContent value="discover" className="flex-1 overflow-auto mt-0 px-6 pt-4 pb-8">
            {publicAssistants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  No public assistants yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Publish your assistant to share it with others.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {publicAssistants.map((assistant) => (
                  <AssistantCard key={assistant.id} assistant={assistant} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateAssistantDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
