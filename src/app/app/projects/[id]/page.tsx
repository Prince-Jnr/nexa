'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Database,
  BookOpen,
  Plus,
  Upload,
  Brain,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MOCK_PROJECTS } from '@/lib/mock/data';
import { useChatStore } from '@/stores/chat-store';
import { formatDate, formatBytes, cn } from '@/lib/utils';
import type { ProjectFile } from '@/types';

// ─── File status badge ────────────────────────────────────────────────────────

function FileStatusBadge({ status }: { status: ProjectFile['status'] }) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle className="h-3 w-3" />
        Ready
      </span>
    );
  }
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3" />
      Error
    </span>
  );
}

// ─── 404 State ────────────────────────────────────────────────────────────────

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Project not found</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        This project doesn't exist or may have been deleted.
      </p>
      <Button variant="outline" onClick={() => router.push('/app/projects')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = MOCK_PROJECTS.find((p) => p.id === id);
  const { conversations, createConversation } = useChatStore();
  const [activeTab, setActiveTab] = useState('conversations');

  if (!project) return <NotFound />;

  const projectConversations = conversations.filter(
    (c) => c.projectId === project.id && !c.isArchived
  );

  const handleOpenInChat = () => {
    const convId = createConversation(`${project.name} — new conversation`);
    router.push(`/app/chat/${convId}`);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/app/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: `${project.color}20` }}
          >
            {project.icon}
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-foreground text-sm leading-tight truncate">
              {project.name}
            </h1>
            <p className="text-xs text-muted-foreground truncate">{project.description}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-nexa-violet hover:bg-nexa-violet/90 text-white"
              onClick={handleOpenInChat}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Open in Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Body — two columns on desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="px-5 pt-4">
              <TabsList className="bg-muted/40 h-9">
                <TabsTrigger value="conversations" className="text-xs px-4">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Conversations
                  {projectConversations.length > 0 && (
                    <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                      {projectConversations.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="files" className="text-xs px-4">
                  <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                  Files
                  {project.files.length > 0 && (
                    <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                      {project.files.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="text-xs px-4">
                  <Brain className="h-3.5 w-3.5 mr-1.5" />
                  Knowledge
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Conversations tab */}
            <TabsContent value="conversations" className="flex-1 overflow-hidden mt-0 pt-4">
              <ScrollArea className="h-full px-5">
                {projectConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
                    <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                      Start a conversation with this project's context and files.
                    </p>
                    <Button size="sm" className="text-xs" onClick={handleOpenInChat}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Start Conversation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pb-6">
                    {projectConversations.map((conv) => (
                      <Link key={conv.id} href={`/app/chat/${conv.id}`}>
                        <div className="group flex items-start gap-3 p-3.5 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-150 cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-nexa-violet/10 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquare className="h-4 w-4 text-nexa-violet" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {conv.title}
                            </p>
                            {conv.lastMessage && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {conv.lastMessage}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-muted-foreground/70">
                                {conv.messageCount} messages
                              </span>
                              <span className="text-[10px] text-muted-foreground/40">·</span>
                              <span className="text-[10px] text-muted-foreground/70">
                                {formatDate(conv.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Files tab */}
            <TabsContent value="files" className="flex-1 overflow-hidden mt-0 pt-4">
              <div className="px-5 mb-3">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  Upload Files
                </Button>
              </div>
              <ScrollArea className="h-full px-5">
                {project.files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No files uploaded</p>
                    <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                      Upload files to give the AI context about your project.
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Upload Files
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pb-6">
                    {project.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 hover:border-border hover:bg-muted/20 transition-all duration-150"
                      >
                        <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(file.size)}
                            </span>
                            <span className="text-xs text-muted-foreground/40">·</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(file.uploadedAt)}
                            </span>
                          </div>
                        </div>
                        <FileStatusBadge status={file.status} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Knowledge tab */}
            <TabsContent value="knowledge" className="flex-1 overflow-auto mt-0 pt-4 px-5">
              <div className="max-w-lg">
                <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-nexa-violet/10 flex items-center justify-center mx-auto mb-4">
                    <Database className="h-7 w-7 text-nexa-violet" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">RAG Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Build a searchable knowledge base from your project files. The AI will
                    automatically retrieve the most relevant context for every conversation.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-left mb-5">
                    {[
                      { icon: '📄', label: 'Documents', desc: 'PDF, DOCX, Markdown' },
                      { icon: '🗄️', label: 'Databases', desc: 'CSV, SQL, JSON' },
                      { icon: '💻', label: 'Code', desc: 'Any language' },
                      { icon: '🌐', label: 'Web pages', desc: 'URLs & sitemaps' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border/50"
                      >
                        <span className="text-base leading-none mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-foreground">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-nexa-violet hover:bg-nexa-violet/90 text-white"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Set Up Knowledge Base
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-border bg-muted/10 overflow-auto">
          <div className="p-5 space-y-5">
            {/* Instructions */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Instructions
                </h3>
              </div>
              <div className="rounded-xl border border-border/50 bg-background p-3.5">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.instructions}
                </p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Stats */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{project.conversationCount}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Conversations</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{project.fileCount}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Files</p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Dates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created</span>
                </div>
                <span className="text-xs text-foreground font-medium">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last updated</span>
                </div>
                <span className="text-xs text-foreground font-medium">
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Color indicator */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">
                Accent Color
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md shadow-sm border border-border/50"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-xs text-muted-foreground font-mono">{project.color}</span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <Button
                className="w-full bg-nexa-violet hover:bg-nexa-violet/90 text-white"
                size="sm"
                onClick={handleOpenInChat}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Chat
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
