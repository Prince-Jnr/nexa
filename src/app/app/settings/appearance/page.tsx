'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';

// ── Theme option cards ────────────────────────────────────────────────────────

interface ThemeOptionProps {
  id: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ElementType;
  selected: boolean;
  onSelect: (id: 'light' | 'dark' | 'system') => void;
}

function ThemeOption({ id, label, icon: Icon, selected, onSelect }: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        'relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
        selected
          ? 'border-nexa-violet bg-nexa-violet/5'
          : 'border-border hover:border-border/80 hover:bg-accent/50'
      )}
    >
      {/* Mini preview */}
      <div
        className={cn(
          'w-full h-20 rounded-lg overflow-hidden border border-border/50',
          id === 'light' && 'bg-white',
          id === 'dark' && 'bg-zinc-900',
          id === 'system' && 'bg-gradient-to-br from-white to-zinc-900'
        )}
      >
        {/* Simulated topbar */}
        <div
          className={cn(
            'h-4 w-full flex items-center px-2 gap-1',
            id === 'light' ? 'bg-zinc-100' : 'bg-zinc-800'
          )}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        </div>
        {/* Simulated content rows */}
        <div className="px-2 pt-2 space-y-1">
          <div className={cn('h-1.5 rounded w-3/4', id === 'light' ? 'bg-zinc-200' : 'bg-zinc-700')} />
          <div className={cn('h-1.5 rounded w-1/2', id === 'light' ? 'bg-zinc-200' : 'bg-zinc-700')} />
          <div className={cn('h-1.5 rounded w-2/3', id === 'light' ? 'bg-zinc-200' : 'bg-zinc-700')} />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Icon className={cn('h-3.5 w-3.5', selected ? 'text-nexa-violet' : 'text-muted-foreground')} />
        <span className={cn('text-sm font-medium', selected ? 'text-nexa-violet' : 'text-foreground')}>
          {label}
        </span>
      </div>

      {selected && (
        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-nexa-violet">
          <Check className="h-3 w-3 text-white" />
        </span>
      )}
    </button>
  );
}

// ── Selectable row ────────────────────────────────────────────────────────────

interface SelectableRowProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

function SelectableRow({ label, selected, onSelect }: SelectableRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between w-full px-4 py-3 rounded-lg border cursor-pointer text-sm font-medium transition-all',
        selected
          ? 'border-nexa-violet bg-nexa-violet/5 text-nexa-violet'
          : 'border-border hover:bg-accent text-foreground'
      )}
    >
      {label}
      {selected && <Check className="h-4 w-4 text-nexa-violet" />}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type FontSize = 'small' | 'medium' | 'large';
type Density = 'comfortable' | 'compact' | 'cozy';

export default function AppearancePage() {
  const { theme, setTheme } = useAppStore();

  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [density, setDensity] = useState<Density>('comfortable');
  const [language, setLanguage] = useState('en');

  function handleThemeSelect(value: 'light' | 'dark' | 'system') {
    setTheme(value);
  }

  const fontSizeOptions: { id: FontSize; label: string }[] = [
    { id: 'small', label: 'Small (13px)' },
    { id: 'medium', label: 'Medium (15px)' },
    { id: 'large', label: 'Large (17px)' },
  ];

  const densityOptions: { id: Density; label: string; description: string }[] = [
    { id: 'comfortable', label: 'Comfortable', description: 'More breathing room between elements' },
    { id: 'compact', label: 'Compact', description: 'Tighter spacing, more content visible' },
    { id: 'cozy', label: 'Cozy', description: 'Balanced — somewhere in between' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">Customise how Nexa looks and feels.</p>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Choose your preferred colour scheme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <ThemeOption
              id="light"
              label="Light"
              icon={Sun}
              selected={theme === 'light'}
              onSelect={handleThemeSelect}
            />
            <ThemeOption
              id="dark"
              label="Dark"
              icon={Moon}
              selected={theme === 'dark'}
              onSelect={handleThemeSelect}
            />
            <ThemeOption
              id="system"
              label="System"
              icon={Monitor}
              selected={theme === 'system'}
              onSelect={handleThemeSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Font size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Font size</CardTitle>
          <CardDescription>Adjust the base text size across the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {fontSizeOptions.map((opt) => (
            <SelectableRow
              key={opt.id}
              label={opt.label}
              selected={fontSize === opt.id}
              onSelect={() => setFontSize(opt.id)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Density */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Density</CardTitle>
          <CardDescription>Control how tightly elements are packed together.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {densityOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDensity(opt.id)}
              className={cn(
                'flex items-center justify-between w-full px-4 py-3 rounded-lg border cursor-pointer text-left transition-all',
                density === opt.id
                  ? 'border-nexa-violet bg-nexa-violet/5'
                  : 'border-border hover:bg-accent'
              )}
            >
              <div>
                <p className={cn('text-sm font-medium', density === opt.id ? 'text-nexa-violet' : 'text-foreground')}>
                  {opt.label}
                </p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
              {density === opt.id && <Check className="h-4 w-4 text-nexa-violet shrink-0" />}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Language</CardTitle>
          <CardDescription>Select your preferred display language.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="language-select">Display language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文 (简体)</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Font size and density settings are saved locally and apply only to this browser.
      </p>
    </div>
  );
}
