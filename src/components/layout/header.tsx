"use client";

import * as React from "react";
import {
  PanelLeft,
  Bell,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Monitor,
  User,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { NEXA_MODELS } from "@/config";
import { NexaLogo } from "@/components/shared/nexa-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { Notification } from "@/types";

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "welcome",
    type: "info",
    title: "Welcome to Nexa",
    message: "Your workspace is ready to use.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "privacy",
    type: "success",
    title: "Privacy controls added",
    message: "Review your data preferences in Settings.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "models",
    type: "info",
    title: "New model access",
    message: "Your available Nexa models are ready in the model menu.",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

// ─── Model category labels ─────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  fast: "Fast",
  pro: "Pro",
  vision: "Vision",
  research: "Research",
  code: "Code",
  creative: "Creative",
};

// Group models by category in a stable order
const CATEGORY_ORDER = ["fast", "pro", "vision", "research", "code", "creative"] as const;

function groupModelsByCategory() {
  const groups: Record<string, typeof NEXA_MODELS> = {};
  for (const model of NEXA_MODELS) {
    if (!groups[model.category]) groups[model.category] = [];
    groups[model.category].push(model);
  }
  return groups;
}

// ─── ModelSelector ─────────────────────────────────────────────────────────────

function ModelSelector() {
  const { selectedModel, setSelectedModel } = useAppStore();
  const currentModel = NEXA_MODELS.find((m) => m.id === selectedModel) ?? NEXA_MODELS[0];
  const groups = React.useMemo(() => groupModelsByCategory(), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border bg-background/60",
            "px-3 py-1.5 text-sm font-medium transition-all duration-150",
            "hover:bg-accent hover:border-border/80 focus:outline-none",
            "max-w-[180px]"
          )}
          aria-label="Select model"
        >
          <span className="text-base leading-none shrink-0" aria-hidden="true">
            {currentModel.icon}
          </span>
          <span className="truncate text-[13px]">{currentModel.name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[280px] p-2"
      >
        <DropdownMenuLabel className="px-2 pb-2 text-xs font-semibold text-muted-foreground">
          Select a model
        </DropdownMenuLabel>

        {CATEGORY_ORDER.map((category) => {
          const models = groups[category];
          if (!models?.length) return null;

          return (
            <React.Fragment key={category}>
              <div className="px-2 py-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {CATEGORY_LABELS[category] ?? category}
                </span>
              </div>

              {models.map((model) => {
                const isSelected = model.id === selectedModel;

                return (
                  <DropdownMenuItem
                    key={model.id}
                    onSelect={() => setSelectedModel(model.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg px-2 py-2 cursor-pointer",
                      isSelected && "bg-nexa-violet/10"
                    )}
                  >
                    <span className="mt-0.5 text-base leading-none shrink-0" aria-hidden="true">
                      {model.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[13px] font-medium leading-tight",
                          isSelected ? "text-nexa-violet" : "text-foreground"
                        )}
                      >
                        {model.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight truncate">
                        {model.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nexa-violet" />
                    )}
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator className="my-1 last:hidden" />
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem("nexa-notifications-list");
        setNotifications(stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS);
      } catch {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    });
  }, []);

  function saveNotifications(next: Notification[]) {
    setNotifications(next);
    localStorage.setItem("nexa-notifications-list", JSON.stringify(next));
  }

  function markRead(id: string) {
    saveNotifications(notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    ));
  }

  function markAllRead() {
    saveNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg",
            "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
          )}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-nexa-violet ring-2 ring-background" aria-hidden="true" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && <button type="button" onClick={markAllRead} className="text-[11px] text-nexa-violet hover:underline">Mark all read</button>}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-5 text-center text-xs text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onSelect={() => markRead(notification.id)} className={cn("items-start gap-2 px-2 py-2.5", !notification.read && "bg-nexa-violet/5")}>
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", notification.read ? "bg-border" : "bg-nexa-violet")} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium">{notification.title}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{notification.message}</span>
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/app/settings/notifications")} className="justify-center gap-2 text-xs text-muted-foreground">
          <Settings className="h-3.5 w-3.5" /> Notification settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── UserMenu ─────────────────────────────────────────────────────────────────

function UserMenu() {
  const { user, theme, setTheme } = useAppStore();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
        <Link href="/signup" className="rounded-lg bg-nexa-violet px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity">Create account</Link>
      </div>
    );
  }

  const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "system", label: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className="focus:outline-none rounded-full"
        >
          <Avatar className="h-8 w-8 ring-2 ring-nexa-violet/20 hover:ring-nexa-violet/50 transition-all cursor-pointer">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-[11px] font-semibold bg-nexa-violet/10 text-nexa-violet">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {/* User identity */}
        <div className="px-2 py-2">
          <p className="text-[13px] font-semibold leading-tight truncate">{user.name}</p>
          <p className="text-[11px] text-muted-foreground leading-tight truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2.5 cursor-pointer" onSelect={() => router.push("/app/settings")}>
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 cursor-pointer" onSelect={() => router.push("/app/settings/billing")}>
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 cursor-pointer">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Theme toggle */}
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Theme
        </DropdownMenuLabel>
        <div className="flex gap-1 px-1 pb-1">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              aria-label={`${opt.label} theme`}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[11px] font-medium transition-colors",
                theme === opt.value
                  ? "bg-nexa-violet/10 text-nexa-violet"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => { signOut(); useAppStore.getState().setUser(null); router.push("/login"); }}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { toggleSidebar, isMobile } = useAppStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center",
        "border-b border-border bg-background/80 backdrop-blur-sm",
        "px-4 gap-3"
      )}
    >
      {/* Left: menu toggle */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        )}
      >
        <PanelLeft className="h-[18px] w-[18px]" />
      </button>

      {/* Center: logo on mobile */}
      {isMobile && (
        <div className="flex-1 flex justify-center">
          <NexaLogo size={22} showText />
        </div>
      )}

      {/* Spacer on desktop */}
      {!isMobile && <div className="flex-1" />}

      {/* Right: model selector + bell + user */}
      <div className="flex items-center gap-2">
        {!isMobile && <ModelSelector />}
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
