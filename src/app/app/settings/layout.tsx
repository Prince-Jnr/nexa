'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, User, Palette, Brain, ShieldCheck, Bell, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const SETTINGS_NAV: SettingsNavItem[] = [
  { label: 'Account', href: '/app/settings', icon: User },
  { label: 'Appearance', href: '/app/settings/appearance', icon: Palette },
  { label: 'Memory', href: '/app/settings/memory', icon: Brain },
  { label: 'Privacy', href: '/app/settings/privacy', icon: ShieldCheck },
  { label: 'Notifications', href: '/app/settings/notifications', icon: Bell },
  { label: 'Billing', href: '/app/settings/billing', icon: CreditCard },
];

function getSectionLabel(pathname: string): string {
  const segment = pathname.split('/').pop() ?? '';
  if (segment === 'settings') return 'Account';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sectionLabel = getSectionLabel(pathname);

  return (
    <div className="flex h-full min-h-screen">
      {/* Left navigation */}
      <aside className="w-56 shrink-0 border-r border-border bg-background/50 flex flex-col">
        {/* Header */}
        <div className="px-4 py-5 border-b border-border">
          <h1 className="text-base font-semibold text-foreground">Settings</h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-2 space-y-0.5">
          {SETTINGS_NAV.map((item) => {
            const isActive =
              item.href === '/app/settings'
                ? pathname === '/app/settings'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-nexa-violet/10 text-nexa-violet'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-nexa-violet' : 'text-muted-foreground'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 px-6 py-4 border-b border-border text-sm text-muted-foreground">
          <span>Settings</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{sectionLabel}</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
