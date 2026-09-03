'use client';

import { useState, useMemo } from 'react';
import {
  Library,
  Upload,
  Search,
  LayoutGrid,
  List,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Database,
  Code2,
  Download,
  MessageSquare,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  Tag,
  FolderKanban,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_LIBRARY, MOCK_PROJECTS } from '@/lib/mock/data';
import { formatDate, formatBytes, cn } from '@/lib/utils';
import type { LibraryItem } from '@/types';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  LibraryItem['type'],
  { label: string; icon: React.ReactNode; color: string; badge: string }
> = {
  document: {
    label: 'Document',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  image: {
    label: 'Image',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'text-pink-500',
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
  audio: {
    label: 'Audio',
    icon: <Music className="h-5 w-5" />,
    color: 'text-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  video: {
    label: 'Video',
    icon: <Video className="h-5 w-5" />,
    color: 'text-red-500',
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  dataset: {
    label: 'Dataset',
    icon: <Database className="h-5 w-5" />,
    color: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  code: {
    label: 'Code',
    icon: <Code2 className="h-5 w-5" />,
    color: 'text-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  research: {
    label: 'Research',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-cyan-500',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
};

type FilterType = 'all' | LibraryItem['type'];
type SortKey = 'name' | 'size' | 'createdAt' | 'type';
type SortDir = 'asc' | 'desc';

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: LibraryItem['type'] }) {
  const config = TYPE_CONFIG[type];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border',
        config.badge
      )}
    >
      {config.label}
    </span>
  );
}

// ─── File Icon ────────────────────────────────────────────────────────────────

function FileIcon({
  type,
  size = 'md',
}: {
  type: LibraryItem['type'];
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = TYPE_CONFIG[type];
  const sizeMap = { sm: 'w-8 h-8', md: 'w-11 h-11', lg: 'w-14 h-14' };
  const iconSizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div
      className={cn(
        sizeMap[size],
        'rounded-xl bg-muted/60 flex items-center justify-center shrink-0',
        config.color
      )}
    >
      <span className={iconSizeMap[size]}>{config.icon}</span>
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({ item }: { item: LibraryItem }) {
  const project = MOCK_PROJECTS.find((p) => p.id === item.projectId);

  return (
    <div className="group relative bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:shadow-md hover:shadow-black/5 transition-all duration-200">
      {/* File icon */}
      <div className="flex items-start justify-between mb-3">
        <FileIcon type={item.type} size="md" />
        {/* Hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Chat about this"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-foreground truncate mb-1" title={item.name}>
        {item.name}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mt-2">
        <TypeBadge type={item.type} />
        <span className="text-xs text-muted-foreground">{formatBytes(item.size)}</span>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px] text-muted-foreground/70">{formatDate(item.createdAt)}</span>
        {project && (
          <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1 truncate max-w-[90px]">
            <FolderKanban className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{project.name}</span>
          </span>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 text-muted-foreground/40" />;
  return sortDir === 'asc' ? (
    <ChevronUp className="h-3 w-3 text-foreground" />
  ) : (
    <ChevronDown className="h-3 w-3 text-foreground" />
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────

function TableView({
  items,
  sortKey,
  sortDir,
  onSort,
}: {
  items: LibraryItem[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'size', label: 'Size' },
    { key: 'createdAt', label: 'Date' },
  ];

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th
                key={h.key}
                className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => onSort(h.key)}
              >
                <span className="flex items-center gap-1.5">
                  {h.label}
                  <SortIcon col={h.key} sortKey={sortKey} sortDir={sortDir} />
                </span>
              </th>
            ))}
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
              Tags
            </th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
              Project
            </th>
            <th className="py-2.5 px-4 w-20" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const project = MOCK_PROJECTS.find((p) => p.id === item.projectId);
            return (
              <tr
                key={item.id}
                className="group border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <FileIcon type={item.type} size="sm" />
                    <span className="font-medium text-foreground truncate max-w-[200px]" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <TypeBadge type={item.type} />
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{formatBytes(item.size)}</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {project && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FolderKanban className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[100px]">{project.name}</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        {hasFilter ? (
          <Search className="h-7 w-7 text-muted-foreground" />
        ) : (
          <Inbox className="h-7 w-7 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        {hasFilter ? 'No files found' : 'Your library is empty'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-5">
        {hasFilter
          ? 'Try adjusting your filters.'
          : 'Upload documents, images, audio, and more to build your knowledge library.'}
      </p>
      {!hasFilter && (
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_TYPES: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'document', label: 'Documents' },
  { value: 'image', label: 'Images' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'dataset', label: 'Datasets' },
  { value: 'code', label: 'Code' },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let items = [...MOCK_LIBRARY];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== 'all') {
      items = items.filter((i) => i.type === typeFilter);
    }
    items.sort((a, b) => {
      let va: string | number = a[sortKey];
      let vb: string | number = b[sortKey];
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return 0;
    });
    return items;
  }, [search, typeFilter, sortKey, sortDir]);

  const hasFilter = search.length > 0 || typeFilter !== 'all';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexa-violet/10 flex items-center justify-center">
              <Library className="h-4 w-4 text-nexa-violet" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Library</h1>
              <p className="text-xs text-muted-foreground">
                {MOCK_LIBRARY.length} file{MOCK_LIBRARY.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-nexa-violet hover:bg-nexa-violet/90 text-white">
            <Upload className="h-4 w-4 mr-1.5" />
            Upload
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 px-6 pb-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/30 border-border/50 focus:bg-background"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
            {FILTER_TYPES.map((ft) => (
              <button
                key={ft.value}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-md transition-all font-medium',
                  typeFilter === ft.value
                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setTypeFilter(ft.value)}
              >
                {ft.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1 ml-auto">
            <button
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'table'
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <EmptyState hasFilter={hasFilter} />
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <GridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <TableView
                items={filtered}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
