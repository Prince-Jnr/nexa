'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Microscope,
  Search,
  Play,
  Loader2,
  CheckCircle2,
  Clock,
  Globe,
  BookOpen,
  Download,
  Share2,
  FileText,
  X,
  ChevronRight,
  Inbox,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NEXA_MODELS } from '@/config';
import { formatDate, truncate, cn } from '@/lib/utils';
import type { ResearchJob } from '@/types';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ResearchJob['status'],
  { label: string; color: string; icon: React.ReactNode }
> = {
  completed: {
    label: 'Completed',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  planning: {
    label: 'Planning',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: <Sparkles className="h-3 w-3" />,
  },
  searching: {
    label: 'Searching',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: <Search className="h-3 w-3" />,
  },
  reviewing: {
    label: 'Reviewing',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    icon: <BookOpen className="h-3 w-3" />,
  },
  'cross-checking': {
    label: 'Cross-checking',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    icon: <ChevronRight className="h-3 w-3" />,
  },
  writing: {
    label: 'Writing',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    icon: <FileText className="h-3 w-3" />,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    icon: <X className="h-3 w-3" />,
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ResearchJob['status'] }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border',
        config.color
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Research Report Dialog ───────────────────────────────────────────────────

function ReportDialog({
  job,
  open,
  onClose,
}: {
  job: ResearchJob | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!job?.report) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
                  <Microscope className="h-3.5 w-3.5 text-nexa-violet" />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Research Report
                </span>
                <StatusBadge status={job.status} />
              </div>
              <DialogTitle className="text-base font-semibold leading-snug line-clamp-2">
                {job.query}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {job.sources.length} sources
                </span>
                {job.completedAt && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(job.completedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Export buttons */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-muted/20 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Export Markdown
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          {job.sources.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-5 mx-1" />
              <span className="text-xs text-muted-foreground">
                {job.sources.length} sources cited
              </span>
            </>
          )}
        </div>

        {/* Report content */}
        <ScrollArea className="flex-1">
          <div className="px-8 py-6">
            <div className="nexa-prose prose prose-sm dark:prose-invert max-w-none">
              {job.report.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={i} className="text-2xl font-bold text-foreground mb-4 mt-2">
                      {line.slice(2)}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-lg font-semibold text-foreground mb-3 mt-6">
                      {line.slice(3)}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className="text-base font-semibold text-foreground mb-2 mt-4">
                      {line.slice(4)}
                    </h3>
                  );
                }
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return (
                  <p key={i} className="text-sm text-foreground/90 leading-relaxed mb-2">
                    {line}
                  </p>
                );
              })}
            </div>

            {/* Sources */}
            {job.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Sources ({job.sources.length})
                </h3>
                <div className="space-y-2.5">
                  {job.sources.map((source, i) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-border hover:bg-muted/20 transition-all group"
                    >
                      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-nexa-violet transition-colors">
                          {source.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {source.snippet}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 truncate">
                          {source.url}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Research Job Card ────────────────────────────────────────────────────────

function ResearchJobCard({
  job,
  onViewReport,
  onRetry,
}: {
  job: ResearchJob;
  onViewReport: (job: ResearchJob) => void;
  onRetry: (query: string) => void;
}) {
  const inProgress =
    job.status !== 'completed' && job.status !== 'failed';

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:shadow-md hover:shadow-black/5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
            {job.query}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Preview snippet for completed */}
      {job.status === 'completed' && job.report && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {job.report.replace(/^#+\s/gm, '').slice(0, 200)}…
        </p>
      )}

      {/* Progress bar for in-progress */}
      {inProgress && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              {STATUS_CONFIG[job.status].label}…
            </span>
            <span className="text-xs font-medium text-foreground">{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-1.5" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {job.sources.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {job.sources.length} sources
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(job.createdAt)}
          </span>
        </div>

        {job.status === 'completed' && job.report && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onViewReport(job)}
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            View Report
          </Button>
        )}
        {job.status === 'failed' && (
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onRetry(job.query)}>
            <Play className="mr-1.5 h-3.5 w-3.5" /> Retry
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('nexa-research');
  const [isStarting, setIsStarting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ResearchJob | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [jobs, setJobs] = useState<ResearchJob[]>([]);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const user = JSON.parse(localStorage.getItem('nexa-current-user') ?? 'null') as { id?: string } | null;
        const saved = localStorage.getItem(`nexa-research-${user?.id ?? 'signed-out'}`);
        setJobs(saved ? JSON.parse(saved) : []);
      } catch {
        setJobs([]);
      }
    });
  }, []);

  function saveJobs(nextJobs: ResearchJob[]) {
    setJobs(nextJobs);
    const user = JSON.parse(localStorage.getItem('nexa-current-user') ?? 'null') as { id?: string } | null;
    localStorage.setItem(`nexa-research-${user?.id ?? 'signed-out'}`, JSON.stringify(nextJobs));
  }

  const researchModels = NEXA_MODELS.filter((m) =>
    ['nexa-research', 'nexa-pro'].includes(m.id)
  );

  const handleStartResearch = async (retryQuery?: string) => {
    const researchQuery = (retryQuery ?? query).trim();
    if (!researchQuery || isStarting) return;
    setError('');
    setIsStarting(true);
    const job: ResearchJob = {
      id: `research-${crypto.randomUUID()}`,
      query: researchQuery,
      status: 'searching',
      sources: [],
      progress: 35,
      createdAt: new Date().toISOString(),
    };
    const nextJobs = [job, ...jobs];
    saveJobs(nextJobs);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuery, model }),
      });
      const result = await response.json() as { report?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Research failed.');
      const completedJob = { ...job, status: 'completed' as const, progress: 100, report: result.report ?? '' };
      saveJobs(nextJobs.map((item) => item.id === job.id ? completedJob : item));
      setQuery('');
    } catch (researchError) {
      const failedJob = { ...job, status: 'failed' as const, progress: 100, report: researchError instanceof Error ? researchError.message : 'Research failed.' };
      saveJobs(nextJobs.map((item) => item.id === job.id ? failedJob : item));
      setError(failedJob.report ?? 'Research failed.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleViewReport = (job: ResearchJob) => {
    setSelectedJob(job);
    setReportOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="w-8 h-8 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
            <Microscope className="h-4 w-4 text-nexa-violet" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Deep Research</h1>
            <p className="text-xs text-muted-foreground">
              Get comprehensive, cited answers to complex questions
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {/* Research input card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <Textarea
              ref={textareaRef}
              placeholder="What do you want to research? Be as specific as possible for best results…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[120px] p-0 leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStartResearch();
              }}
            />

            <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-8 w-44 text-xs bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {researchModels.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-xs">
                        <span className="flex items-center gap-2">
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground/60">⌘↵ to start</span>
              </div>

              <Button
                onClick={() => void handleStartResearch()}
                disabled={!query.trim() || isStarting}
                className="bg-nexa-violet hover:bg-nexa-violet/90 text-white h-9"
                size="sm"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Research
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          {/* Example prompts */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Example queries
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Compare the top LLM providers in 2026',
                'How do AI agents work?',
                'Impact of AI on software engineering',
                'Vector databases comparison',
              ].map((example) => (
                <button
                  key={example}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Research jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Research History
              </h2>
              <span className="text-xs text-muted-foreground">
                {jobs.length} total
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No research yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Start your first research query above to get comprehensive, cited answers.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <ResearchJobCard
                    key={job.id}
                    job={job}
                    onViewReport={handleViewReport}
                    onRetry={(retryQuery) => void handleStartResearch(retryQuery)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report dialog */}
      <ReportDialog
        job={selectedJob}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
