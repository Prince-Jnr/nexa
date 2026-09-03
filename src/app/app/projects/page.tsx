'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Search,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Settings,
  ExternalLink,
  Clock,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_PROJECTS } from '@/lib/mock/data';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 cursor-pointer"
      onClick={() => router.push(`/app/projects/${project.id}`)}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: project.color }}
      />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon bubble */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
              style={{ backgroundColor: `${project.color}20` }}
            >
              {project.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
                {project.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/app/projects/${project.id}`);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{project.conversationCount} conversations</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Paperclip className="h-3.5 w-3.5" />
            <span>{project.fileCount} files</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        {hasSearch ? (
          <Search className="h-7 w-7 text-muted-foreground" />
        ) : (
          <Inbox className="h-7 w-7 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        {hasSearch ? 'No projects found' : 'No projects yet'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {hasSearch
          ? 'Try adjusting your search query.'
          : 'Create a project to give your AI assistant persistent context, files, and instructions.'}
      </p>
      {!hasSearch && (
        <Button className="mt-5" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROJECTS.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-nexa-violet" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Projects</h1>
              <p className="text-xs text-muted-foreground">
                {MOCK_PROJECTS.length} project{MOCK_PROJECTS.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-nexa-violet hover:bg-nexa-violet/90 text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/30 border-border/50 focus:bg-background"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <EmptyState hasSearch={search.length > 0} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {/* New Project card */}
            <button className="group border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-nexa-violet/40 hover:bg-nexa-violet/5 transition-all duration-200 min-h-[140px]">
              <div className="w-10 h-10 rounded-xl bg-muted/50 group-hover:bg-nexa-violet/10 flex items-center justify-center transition-colors">
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-nexa-violet transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-nexa-violet transition-colors">
                  New Project
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Create a persistent AI workspace</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
