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
    <div className="flex h-full min-h-screen min-w-0 flex-col md:flex-row">
      {/* Left navigation */}
      <aside className="w-full shrink-0 border-b border-border bg-background/50 md:w-56 md:border-b-0 md:border-r">
        {/* Header */}
        <div className="border-b border-border px-4 py-4 md:py-5">
          <h1 className="text-base font-semibold text-foreground">Settings</h1>
        </div>

        {/* Nav links */}
        <nav className="flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:space-y-0.5">
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
                  'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3 text-sm text-muted-foreground md:px-6 md:py-4">
          <span>Settings</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{sectionLabel}</span>
        </div>

        {/* Page content */}
        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
