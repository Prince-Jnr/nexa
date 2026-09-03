'use client';

import { useState } from 'react';
import { Pencil, X, Plus, Trash2, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MOCK_MEMORIES } from '@/lib/mock/data';
import { formatDate, cn } from '@/lib/utils';
import type { Memory } from '@/types';

const CATEGORY_LABELS: Record<Memory['category'], string> = {
  user: 'User',
  writing: 'Writing',
  technical: 'Technical',
  project: 'Project',
  goals: 'Goals',
};

const CATEGORY_COLORS: Record<Memory['category'], string> = {
  user: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  writing: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  technical: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  project: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  goals: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
};

interface MemoryItemProps {
  memory: Memory;
  onDelete: (id: string) => void;
  onEdit: (memory: Memory) => void;
}

function MemoryItem({ memory, onDelete, onEdit }: MemoryItemProps) {
  return (
    <div className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm text-foreground leading-relaxed">{memory.content}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn('text-xs capitalize', CATEGORY_COLORS[memory.category])}
          >
            {CATEGORY_LABELS[memory.category]}
          </Badge>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{memory.source}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(memory.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(memory)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Edit memory"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(memory.id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Delete memory"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS = ['all', 'user', 'writing', 'technical', 'project', 'goals'] as const;
type TabValue = typeof TABS[number];

export default function MemoryPage() {
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Memory['category']>('user');

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editContent, setEditContent] = useState('');

  // Clear all dialog
  const [clearOpen, setClearOpen] = useState(false);

  function handleDelete(id: string) {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }

  function handleEdit(memory: Memory) {
    setEditingMemory(memory);
    setEditContent(memory.content);
    setEditOpen(true);
  }

  function handleSaveEdit() {
    if (!editingMemory) return;
    setMemories((prev) =>
      prev.map((m) =>
        m.id === editingMemory.id
          ? { ...m, content: editContent, updatedAt: new Date().toISOString() }
          : m
      )
    );
    setEditOpen(false);
    setEditingMemory(null);
  }

  function handleAdd() {
    if (!newContent.trim()) return;
    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      category: newCategory,
      content: newContent.trim(),
      source: 'Manual entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMemory, ...prev]);
    setNewContent('');
    setNewCategory('user');
    setAddOpen(false);
  }

  function handleClearAll() {
    setMemories([]);
    setClearOpen(false);
  }

  const filtered =
    activeTab === 'all'
      ? memories
      : memories.filter((m) => m.category === activeTab);

  const totalCount = memories.length;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Memory</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Nexa remembers context about you to personalise responses.
        </p>
      </div>

      {/* Memory toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
                <Brain className="h-4.5 w-4.5 text-nexa-violet" />
              </div>
              <div>
                <Label htmlFor="memory-toggle" className="text-sm font-medium cursor-pointer">
                  Enable Memory
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow Nexa to remember context from your conversations
                </p>
              </div>
            </div>
            <Switch
              id="memory-toggle"
              checked={memoryEnabled}
              onCheckedChange={setMemoryEnabled}
              aria-label="Toggle memory"
            />
          </div>
        </CardContent>
      </Card>

      {/* Memories list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Stored memories</CardTitle>
              <CardDescription>{totalCount} memor{totalCount === 1 ? 'y' : 'ies'} saved</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Clear all */}
              <Dialog open={clearOpen} onOpenChange={setClearOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5">
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear all
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear all memories?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete all {totalCount} stored memories. Nexa will lose all
                      context about you. This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setClearOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleClearAll}>
                      Clear all memories
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Add memory */}
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="nexa" size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Add memory
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a memory</DialogTitle>
                    <DialogDescription>
                      Manually add a piece of information for Nexa to remember about you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(CATEGORY_LABELS) as Memory['category'][]).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewCategory(cat)}
                            className={cn(
                              'px-3 py-1 rounded-md text-xs font-medium border cursor-pointer transition-all',
                              newCategory === cat
                                ? CATEGORY_COLORS[cat]
                                : 'border-border text-muted-foreground hover:bg-accent'
                            )}
                          >
                            {CATEGORY_LABELS[cat]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-memory-content">Memory content</Label>
                      <Textarea
                        id="new-memory-content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="e.g. Prefers TypeScript over JavaScript for all new projects."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="nexa" onClick={handleAdd} disabled={!newContent.trim()}>
                      Save memory
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({memories.length})</TabsTrigger>
              {(Object.keys(CATEGORY_LABELS) as Memory['category'][]).map((cat) => {
                const count = memories.filter((m) => m.category === cat).length;
                return (
                  <TabsTrigger key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* All tab and per-category tabs */}
            {(['all', ...Object.keys(CATEGORY_LABELS)] as Array<TabValue>).map((tab) => (
              <TabsContent key={tab} value={tab}>
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="h-8 w-8 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No memories in this category yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((memory) => (
                      <MemoryItem
                        key={memory.id}
                        memory={memory}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit memory</DialogTitle>
            <DialogDescription>Update the content of this stored memory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="edit-memory-content">Memory content</Label>
            <Textarea
              id="edit-memory-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="nexa" onClick={handleSaveEdit} disabled={!editContent.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
