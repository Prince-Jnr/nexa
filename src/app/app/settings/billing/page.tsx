'use client';

import { CreditCard, Receipt, Zap, Check, MessageSquare, HardDrive, Microscope, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PLANS } from '@/config';
import { MOCK_USER, MOCK_USAGE } from '@/lib/mock/data';
import { formatBytes, cn } from '@/lib/utils';
import type { Plan } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN_BADGE_CLASSES: Record<string, string> = {
  free: 'border-border text-muted-foreground bg-transparent',
  plus: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  pro: 'border-nexa-violet/30 bg-nexa-violet/10 text-nexa-violet',
  enterprise: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const PLAN_ACCENT: Record<string, string> = {
  free: 'from-zinc-500 to-zinc-600',
  plus: 'from-blue-500 to-indigo-600',
  pro: 'from-nexa-violet to-nexa-indigo',
  enterprise: 'from-amber-500 to-orange-600',
};

// ── Usage row ─────────────────────────────────────────────────────────────────

interface UsageRowProps {
  icon: React.ElementType;
  label: string;
  used: number | string;
  limit: number | string;
  percent: number;
  unit?: string;
}

function UsageRow({ icon: Icon, label, used, limit, percent, unit = '' }: UsageRowProps) {
  const color =
    percent >= 90
      ? 'bg-destructive'
      : percent >= 70
      ? 'bg-amber-500'
      : 'bg-nexa-violet';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </div>
        <span className="text-foreground font-medium">
          {used}{unit} / {limit === 99999 ? '∞' : `${limit}${unit}`}
        </span>
      </div>
      <Progress value={percent > 100 ? 100 : percent} className="h-1.5 [&>[data-radix-progress-indicator]]:bg-current" />
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: Plan;
  currentPlanId: string;
}

function PlanCard({ plan, currentPlanId }: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId;
  const isPopular = plan.isPopular;
  const isEnterprise = plan.id === 'enterprise';
  const isDowngrade =
    ['free', 'plus', 'pro', 'enterprise'].indexOf(plan.id) <
    ['free', 'plus', 'pro', 'enterprise'].indexOf(currentPlanId);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border p-6 transition-all',
        isCurrent
          ? 'border-nexa-violet ring-1 ring-nexa-violet/30 bg-nexa-violet/5'
          : isPopular
          ? 'border-blue-500/40 bg-blue-500/3'
          : 'border-border bg-card'
      )}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-3 py-0.5 text-xs">
            Most popular
          </Badge>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="outline" className={cn('border', PLAN_BADGE_CLASSES[plan.id], 'px-3 py-0.5 text-xs')}>
            Current plan
          </Badge>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{plan.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        {isEnterprise ? (
          <div className="text-2xl font-bold text-foreground">Custom</div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-foreground">
              {plan.price === 0 ? 'Free' : `$${plan.price}`}
            </span>
            {plan.price > 0 && (
              <span className="text-sm text-muted-foreground mb-1">/mo</span>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <Button variant="outline" size="sm" className="w-full">
          Manage subscription
        </Button>
      ) : isEnterprise ? (
        <Button variant="outline" size="sm" className="w-full">
          Contact us
        </Button>
      ) : isDowngrade ? (
        <Button variant="outline" size="sm" className="w-full text-muted-foreground">
          Downgrade
        </Button>
      ) : (
        <Button
          variant="nexa"
          size="sm"
          className="w-full"
        >
          <Zap className="h-3.5 w-3.5" />
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  );
}

// ── Mock invoice rows ─────────────────────────────────────────────────────────

const MOCK_INVOICES = [
  { id: 'inv-001', date: 'Sep 1, 2026', amount: '$50.00', plan: 'Pro', status: 'Paid' },
  { id: 'inv-002', date: 'Aug 1, 2026', amount: '$50.00', plan: 'Pro', status: 'Paid' },
  { id: 'inv-003', date: 'Jul 1, 2026', amount: '$50.00', plan: 'Pro', status: 'Paid' },
  { id: 'inv-004', date: 'Jun 1, 2026', amount: '$20.00', plan: 'Plus', status: 'Paid' },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function BillingPage() {
  const user = MOCK_USER;
  const usage = MOCK_USAGE;

  const currentPlan = PLANS.find((p) => p.id === user.plan) ?? PLANS[0];
  const planLabel = currentPlan.name;

  const msgPct = Math.round((usage.messages.used / usage.messages.limit) * 100);
  const storagePct = Math.round((usage.storage.used / usage.storage.limit) * 100);
  const researchPct = Math.round((usage.research.used / usage.research.limit) * 100);
  const imagePct = Math.round((usage.imageGen.used / usage.imageGen.limit) * 100);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription, usage, and payment details.</p>
      </div>

      {/* Current plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">Current plan</CardTitle>
              <CardDescription>Renews on October 1, 2026</CardDescription>
            </div>
            <Badge variant="outline" className={cn('text-sm px-3 py-1', PLAN_BADGE_CLASSES[user.plan])}>
              {planLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}`}
                {currentPlan.price > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Manage subscription
              </Button>
              {user.plan !== 'enterprise' && (
                <Button variant="nexa" size="sm" className="gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Usage overview */}
          <div>
            <p className="text-sm font-medium text-foreground mb-4">Usage this month</p>
            <div className="space-y-4">
              <UsageRow
                icon={MessageSquare}
                label="Messages"
                used={usage.messages.used.toLocaleString()}
                limit={usage.messages.limit === 99999 ? 99999 : usage.messages.limit}
                percent={msgPct}
                unit=""
              />
              <UsageRow
                icon={HardDrive}
                label="Storage"
                used={`${usage.storage.used} GB`}
                limit={`${usage.storage.limit} GB`}
                percent={storagePct}
              />
              <UsageRow
                icon={Microscope}
                label="Deep Research"
                used={usage.research.used}
                limit={usage.research.limit}
                percent={researchPct}
                unit=" runs"
              />
              <UsageRow
                icon={Image}
                label="Image generations"
                used={usage.imageGen.used}
                limit={usage.imageGen.limit}
                percent={imagePct}
                unit=""
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans comparison */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Compare plans</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose the plan that fits your needs.</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currentPlanId={user.plan} />
          ))}
        </div>
      </div>

      {/* Payment method */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Payment method</CardTitle>
          </div>
          <CardDescription>Manage your payment information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-9 w-14 rounded-md bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-border">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12 / 2028</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Invoice history</CardTitle>
          </div>
          <CardDescription>Download past invoices for your records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {MOCK_INVOICES.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                    <p className="text-xs text-muted-foreground">{invoice.plan} Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground font-medium">{invoice.amount}</span>
                  <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
