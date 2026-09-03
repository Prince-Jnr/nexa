'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { NEXA_MODELS } from '@/config';

interface TypingIndicatorProps {
  /** Override the model name displayed. Defaults to active model. */
  modelId?: string;
  className?: string;
}

export function TypingIndicator({ modelId, className }: TypingIndicatorProps) {
  const { selectedModel } = useAppStore();
  const resolvedModelId = modelId ?? selectedModel;
  const model = NEXA_MODELS.find((m) => m.id === resolvedModelId);
  const modelName = model?.name ?? 'Sad';

  return (
    <div
      className={cn('flex items-start gap-3 px-4 py-2 animate-fade-in', className)}
      role="status"
      aria-label={`${modelName} is thinking`}
      aria-live="polite"
    >
      {/* Model avatar / icon */}
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nexa-violet/10 text-sm select-none">
        {model?.icon ?? '✦'}
      </div>

      <div className="flex flex-col gap-1.5 pt-0.5">
        {/* Animated dots */}
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-nexa-violet/60"
              style={{
                animation: 'typing 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Status text + model badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground animate-pulse-soft">
            Nexa is thinking…
          </span>
          <span className="inline-flex items-center rounded-full bg-nexa-violet/10 px-2 py-0.5 text-xs font-medium text-nexa-violet">
            {modelName}
          </span>
        </div>
      </div>
    </div>
  );
}
