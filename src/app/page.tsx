import Link from 'next/link';
import { NexaLogo } from '@/components/shared/nexa-logo';
import { Button } from '@/components/ui/button';
import { PLANS, APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/config';
import { Check, ArrowRight, Microscope, Code2, Eye, Mic, FolderKanban, Brain, Zap, Globe, Bot } from 'lucide-react';

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <NexaLogo size={26} />

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {['Product', 'Research', 'Pricing', 'Enterprise'].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Button variant="nexa" size="sm" asChild>
            <Link href="/app">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ── Product mockup ────────────────────────────────────────────────────────────

function ProductMockup() {
  return (
    <div className="relative mx-auto max-w-4xl mt-16">
      {/* Outer glow */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl scale-110" />

      {/* Gradient border wrapper */}
      <div className="p-px rounded-2xl bg-gradient-to-br from-violet-500/50 via-indigo-500/30 to-white/5 shadow-2xl shadow-violet-900/30">
        <div className="rounded-2xl overflow-hidden bg-zinc-900 flex h-[420px]">
          {/* Sidebar */}
          <div className="w-52 shrink-0 bg-zinc-950 border-r border-white/5 flex flex-col">
            {/* Logo area */}
            <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />
              <div className="h-3 w-16 rounded bg-white/20" />
            </div>
            {/* New chat */}
            <div className="px-3 py-3">
              <div className="h-8 rounded-lg bg-gradient-to-r from-violet-600/40 to-indigo-600/40 border border-violet-500/20 flex items-center px-3 gap-2">
                <div className="h-3 w-3 rounded bg-violet-400/60" />
                <div className="h-2 w-20 rounded bg-white/20" />
              </div>
            </div>
            {/* Nav items */}
            <div className="px-2 space-y-0.5 flex-1">
              {[
                { active: true, w: 'w-10' },
                { active: false, w: 'w-14' },
                { active: false, w: 'w-12' },
                { active: false, w: 'w-16' },
                { active: false, w: 'w-10' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-md flex items-center px-3 gap-2 ${
                    item.active ? 'bg-violet-600/20' : ''
                  }`}
                >
                  <div className={`h-3 w-3 rounded bg-white/${item.active ? '40' : '15'}`} />
                  <div className={`h-2 ${item.w} rounded bg-white/${item.active ? '30' : '10'}`} />
                </div>
              ))}
            </div>
            {/* User avatar row */}
            <div className="px-3 py-3 border-t border-white/5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-2 w-20 rounded bg-white/20" />
                <div className="h-1.5 w-28 rounded bg-white/10" />
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-5 justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-36 rounded bg-white/15" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 rounded-md bg-violet-600/20 border border-violet-500/20" />
                <div className="h-6 w-6 rounded-md bg-white/5" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-6 py-6 space-y-5 overflow-hidden">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-xs bg-violet-600/30 border border-violet-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <div className="space-y-1.5">
                    <div className="h-2 w-52 rounded bg-white/30" />
                    <div className="h-2 w-40 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 mt-0.5 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white/70" />
                </div>
                <div className="flex-1 space-y-2 bg-white/4 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-white/20" />
                    <div className="h-2 w-5/6 rounded bg-white/15" />
                    <div className="h-2 w-4/5 rounded bg-white/15" />
                  </div>
                  <div className="pt-1 space-y-1">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
                        <div className="h-1.5 rounded bg-white/15" style={{ width: `${55 + n * 12}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User message 2 */}
              <div className="flex justify-end">
                <div className="max-w-xs bg-violet-600/30 border border-violet-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <div className="h-2 w-44 rounded bg-white/30" />
                </div>
              </div>

              {/* Streaming assistant message */}
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 mt-0.5 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white/70" />
                </div>
                <div className="flex-1 space-y-2 bg-white/4 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-white/20" />
                    <div className="h-2 w-3/4 rounded bg-white/15" />
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-24 rounded bg-white/10" />
                      <div className="h-3 w-0.5 bg-violet-400 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="px-5 pb-5">
              <div className="h-11 rounded-xl bg-white/5 border border-white/10 flex items-center px-4 gap-3">
                <div className="h-2 w-48 rounded bg-white/15" />
                <div className="ml-auto flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-white/10" />
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-sm bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature strip ─────────────────────────────────────────────────────────────

const FEATURE_PILLS = [
  { icon: Microscope, label: 'Deep Research' },
  { icon: Code2, label: 'Code' },
  { icon: Eye, label: 'Vision' },
  { icon: Mic, label: 'Voice' },
  { icon: FolderKanban, label: 'Projects' },
  { icon: Brain, label: 'Memory' },
] as const;

function FeatureStrip() {
  return (
    <section className="py-14 border-y border-white/6 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-center flex-wrap gap-3">
          {FEATURE_PILLS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/4 text-sm text-zinc-300 hover:border-violet-500/40 hover:text-white transition-all"
            >
              <Icon className="h-4 w-4 text-violet-400" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Research mock UI ──────────────────────────────────────────────────────────

function ResearchMockUI() {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 overflow-hidden">
      {/* Top bar */}
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Microscope className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-white font-medium">Deep Research</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400">Searching 24 sources</span>
        </div>
      </div>
      {/* Source list */}
      <div className="p-4 space-y-2">
        {[
          { domain: 'nature.com', title: 'Large Language Models in 2026', rel: 97 },
          { domain: 'arxiv.org', title: 'Chain-of-Thought Prompting Survey', rel: 94 },
          { domain: 'stanford.edu', title: 'HAI AI Index Annual Report', rel: 91 },
        ].map((source) => (
          <div key={source.domain} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/4 border border-white/6">
            <div className="h-6 w-6 rounded bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Globe className="h-3 w-3 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{source.title}</p>
              <p className="text-xs text-zinc-500">{source.domain}</p>
            </div>
            <span className="text-xs font-medium text-emerald-400 shrink-0">{source.rel}%</span>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1.5 text-xs text-zinc-400">
          <span>Synthesising report…</span>
          <span>68%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </div>
      </div>
    </div>
  );
}

// ── Projects mock UI ──────────────────────────────────────────────────────────

function ProjectsMockUI() {
  const projects = [
    { icon: '✦', name: 'Nexa Redesign', color: 'from-violet-500 to-indigo-500', convs: 12, files: 8 },
    { icon: '🔬', name: 'AI Research Hub', color: 'from-cyan-500 to-blue-500', convs: 18, files: 23 },
    { icon: '📣', name: 'Marketing Q4', color: 'from-pink-500 to-rose-500', convs: 7, files: 5 },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-2">
        <FolderKanban className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-medium text-white">Projects</span>
      </div>
      <div className="p-4 space-y-2">
        {projects.map((p) => (
          <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/4 border border-white/6 hover:border-violet-500/20 transition-colors cursor-default">
            <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-base shrink-0`}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.convs} conversations · {p.files} files</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature showcase section ──────────────────────────────────────────────────

interface ShowcaseSectionProps {
  tag: string;
  heading: string;
  description: string;
  reverse?: boolean;
  mockUI: React.ReactNode;
}

function ShowcaseSection({ tag, heading, description, reverse = false, mockUI }: ShowcaseSectionProps) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className={`flex flex-col gap-12 items-center lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text */}
          <div className="flex-1 space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-medium text-violet-400">
              {tag}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
              {heading}
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">{description}</p>
            <Button variant="outline" size="lg" className="gap-2 border-white/15 text-white hover:bg-white/8" asChild>
              <Link href="/app">
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full max-w-lg">
            {mockUI}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Multimodal mock UI ────────────────────────────────────────────────────────

function MultimodalMockUI() {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-2">
        <Eye className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-medium text-white">Multimodal Intelligence</span>
      </div>
      <div className="p-4 space-y-3">
        {/* Image analysis row */}
        <div className="p-3 rounded-lg bg-white/4 border border-white/6 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-20 w-28 rounded-lg bg-gradient-to-br from-violet-800/40 to-indigo-800/40 border border-white/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-violet-400/60" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-xs text-zinc-400">Analysing image…</div>
              <div className="space-y-1">
                <div className="h-2 w-full rounded bg-white/15" />
                <div className="h-2 w-3/4 rounded bg-white/10" />
                <div className="h-2 w-4/5 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
        {/* Capability badges */}
        <div className="flex flex-wrap gap-2">
          {['Vision', 'Audio', 'Video', 'PDFs', 'Data'].map((cap) => (
            <span key={cap} className="px-2.5 py-1 rounded-md text-xs border border-violet-500/20 bg-violet-500/8 text-violet-300">
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Assistants mock UI ────────────────────────────────────────────────────────

function AssistantsMockUI() {
  const assistants = [
    { icon: '⚛', name: 'Frontend Architect', model: 'Nexa Code', color: 'from-violet-500/20 to-indigo-500/20' },
    { icon: '📊', name: 'Research Analyst', model: 'Nexa Research', color: 'from-cyan-500/20 to-blue-500/20' },
    { icon: '✍', name: 'Writing Partner', model: 'Nexa Creative', color: 'from-pink-500/20 to-rose-500/20' },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Custom Assistants</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-violet-600/20 border border-violet-500/20 text-xs text-violet-400 cursor-default">
          + Create
        </div>
      </div>
      <div className="p-4 space-y-2">
        {assistants.map((a) => (
          <div key={a.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/4 border border-white/6">
            <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-lg shrink-0`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{a.name}</p>
              <p className="text-xs text-zinc-500">{a.model}</p>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pricing section ───────────────────────────────────────────────────────────

function PricingSection() {
  const tierOrder = ['free', 'plus', 'pro', 'enterprise'];

  return (
    <section id="pricing" className="py-24 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-medium text-violet-400 mx-auto">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Start free. Upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.sort((a, b) => tierOrder.indexOf(a.id) - tierOrder.indexOf(b.id)).map((plan) => {
            const isPopular = plan.isPopular;
            const isEnterprise = plan.id === 'enterprise';

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  isPopular
                    ? 'border-violet-500/60 bg-gradient-to-b from-violet-950/60 to-zinc-900 shadow-xl shadow-violet-900/20'
                    : 'border-white/10 bg-zinc-900'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {isEnterprise ? (
                    <p className="text-3xl font-bold text-white">Custom</p>
                  ) : plan.price === 0 ? (
                    <p className="text-3xl font-bold text-white">Free</p>
                  ) : (
                    <div className="flex items-end gap-1">
                      <p className="text-3xl font-bold text-white">${plan.price}</p>
                      <p className="text-zinc-500 mb-1">/mo</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isEnterprise ? (
                  <Button
                    variant="outline"
                    className="w-full border-white/15 text-white hover:bg-white/8"
                    asChild
                  >
                    <Link href="mailto:enterprise@nexa.ai">Contact us</Link>
                  </Button>
                ) : plan.price === 0 ? (
                  <Button
                    variant="outline"
                    className="w-full border-white/15 text-white hover:bg-white/8"
                    asChild
                  >
                    <Link href="/app">Get started free</Link>
                  </Button>
                ) : (
                  <Button variant="nexa" className="w-full gap-2" asChild>
                    <Link href="/app">
                      Get {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA section ───────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
        <h2 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
          Ready to work<br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            smarter?
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals, researchers, and teams who use {APP_NAME} to do the best work of their lives.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="nexa" size="xl" className="gap-2" asChild>
            <Link href="/app">
              Start with {APP_NAME} — it&apos;s free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-white/15 text-white hover:bg-white/8 gap-2"
            asChild
          >
            <Link href="#pricing">
              View pricing
            </Link>
          </Button>
        </div>
        <p className="text-sm text-zinc-600">No credit card required · Free tier available · Cancel anytime</p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const year = 2026;
  const cols = [
    {
      heading: 'Product',
      links: ['Features', 'Research', 'Pricing', 'Changelog', 'Roadmap'],
    },
    {
      heading: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    },
    {
      heading: 'Resources',
      links: ['Documentation', 'API', 'Status', 'Security', 'Privacy'],
    },
    {
      heading: 'Legal',
      links: ['Terms', 'Privacy Policy', 'Cookie Policy', 'GDPR'],
    },
  ];

  return (
    <footer className="border-t border-white/8 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <NexaLogo size={24} />
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              {APP_TAGLINE}
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {year} {APP_NAME} AI. All rights reserved.</p>
          <p>Built with care for the future of work.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* ── Hero ── */}
      <section id="product" className="relative pt-20 pb-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-gradient-to-b from-violet-900/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 h-72 w-72 bg-indigo-800/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 h-64 w-64 bg-violet-700/10 rounded-full blur-3xl" />
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-300 mb-8">
            <Zap className="h-3.5 w-3.5" />
            Introducing {APP_NAME} — the AI workspace
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-white">One workspace.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
              Every capability.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            {APP_DESCRIPTION}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="nexa" size="xl" className="gap-2 shadow-xl shadow-violet-900/30 min-w-48" asChild>
              <Link href="/app">
                Start with {APP_NAME}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/15 text-zinc-200 hover:bg-white/6 hover:text-white gap-2 min-w-48"
              asChild
            >
              <Link href="#product">
                See how it works
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="text-sm text-zinc-600 mt-6">
            Trusted by 50,000+ researchers, engineers, and creators worldwide
          </p>

          {/* Product mockup */}
          <ProductMockup />
        </div>
      </section>

      <FeatureStrip />

      {/* ── Feature showcase sections ── */}
      <div className="bg-zinc-950">
        <ShowcaseSection
          tag="Deep Research"
          heading="Research anything. Deeply."
          description="Nexa Research autonomously searches dozens of sources, cross-checks facts, and synthesises comprehensive reports — in minutes, not hours."
          mockUI={<ResearchMockUI />}
        />

        <div className="bg-zinc-900/40">
          <ShowcaseSection
            tag="Projects"
            heading="Persistent AI environments."
            description="Create Projects with uploaded files, custom instructions, and dedicated context. Every conversation in a project remembers what came before."
            reverse
            mockUI={<ProjectsMockUI />}
          />
        </div>

        <ShowcaseSection
          tag="Multimodal Intelligence"
          heading="See, hear, and understand everything."
          description="Analyse images, audio recordings, video clips, PDFs, and complex datasets. Nexa Vision connects visual understanding to intelligent action."
          mockUI={<MultimodalMockUI />}
        />

        <div className="bg-zinc-900/40">
          <ShowcaseSection
            tag="Custom Assistants"
            heading="Create your own AI team."
            description="Build specialised assistants with custom instructions, knowledge files, and specific model configurations. Share them with your team or publish publicly."
            reverse
            mockUI={<AssistantsMockUI />}
          />
        </div>
      </div>

      <PricingSection />

      <CTASection />

      <Footer />
    </div>
  );
}
