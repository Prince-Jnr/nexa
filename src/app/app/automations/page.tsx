'use client';

import { Zap } from 'lucide-react';

export default function AutomationsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Automations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Build and manage AI-powered workflows</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <Zap className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Automations coming soon</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create powerful AI workflows that run automatically. Connect your tools, trigger actions, and automate repetitive tasks.
        </p>
      </div>
    </div>
  );
}
