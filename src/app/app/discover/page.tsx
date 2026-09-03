'use client';

import { Compass } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Discover</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Explore templates, prompts, and community assistants</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
          <Compass className="h-8 w-8 text-cyan-500" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Discover coming soon</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Browse curated AI assistants, prompt templates, and community-built tools to supercharge your workflow.
        </p>
      </div>
    </div>
  );
}
