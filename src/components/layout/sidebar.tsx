"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  FolderKanban,
  Microscope,
  Library,
  Bot,
  Zap,
  Compass,
  Settings,
  Plus,
  Pin,
  PinOff,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn, formatDate, getInitials } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useChatStore } from "@/stores/chat-store";
import { NAV_ITEMS } from "@/config";
import { NexaLogo } from "@/components/shared/nexa-logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  MessageSquare,
  FolderKanban,
  Microscope,
  Library,
  Bot,
  Zap,
  Compass,
};

// ─── Plan badge colours ────────────────────────────────────────────────────────

const PLAN_STYLES: Record<string, string> = {
  free: "bg-muted text-muted-foreground border-border",
  plus: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pro: "bg-nexa-violet/10 text-nexa-violet border-nexa-violet/20",
  enterprise: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  id: string;
  label: string;
  icon: string;
  href: string;
  collapsed: boolean;
  active: boolean;
}

function NavItem({ label, icon, href, collapsed, active }: NavItemProps) {
  const Icon = ICON_MAP[icon] ?? Home;

  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        "group relative select-none",
        active
          ? "bg-nexa-violet/10 text-nexa-violet"
          : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground",
        collapsed && "justify-center px-0 w-10 h-10 mx-auto"
      )}
    >
      {/* Active indicator bar */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-nexa-violet" />
      )}
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          collapsed ? "h-[18px] w-[18px]" : "h-4 w-4",
          active ? "text-nexa-violet" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─── ConversationItem ─────────────────────────────────────────────────────────

interface ConversationItemProps {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
  isActive: boolean;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

function ConversationItem({
  id,
  title,
  updatedAt,
  isPinned,
  isActive,
  onPin,
  onDelete,
  onClick,
}: ConversationItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-150",
        isActive
          ? "bg-nexa-violet/10 text-foreground"
          : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(id)}
    >
      {/* Active bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-nexa-violet" />
      )}

      <div className="flex-1 min-w-0 pr-1">
        <p className="truncate text-[13px] font-medium leading-tight">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/70 truncate">{formatDate(updatedAt)}</p>
      </div>

      {/* Hover actions */}
      {hovered && (
        <div
          className="flex items-center gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label={isPinned ? "Unpin" : "Pin"}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => onPin(id)}
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
          <button
            aria-label="Delete conversation"
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar content (shared between normal and drawer mode) ──────────────────

interface SidebarContentProps {
  collapsed: boolean;
  onClose?: () => void;
}

function SidebarContent({ collapsed, onClose }: SidebarContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, setSidebarCollapsed } = useAppStore();
  const {
    activeConversationId,
    searchQuery,
    setSearchQuery,
    createConversation,
    setActiveConversation,
    togglePin,
    deleteConversation,
    getPinnedConversations,
    getRecentConversations,
    getFilteredConversations,
  } = useChatStore();

  const pinnedConversations = getPinnedConversations();
  const recentConversations = getRecentConversations();
  const filteredConversations = getFilteredConversations();

  // When searching, show filtered list instead of pinned/recent split
  const isSearching = searchQuery.trim().length > 0;

  function handleNewChat() {
    const id = createConversation();
    setActiveConversation(id);
    router.push(`/app/chat/${id}`);
    onClose?.();
  }

  function handleConversationClick(id: string) {
    setActiveConversation(id);
    router.push(`/app/chat/${id}`);
    onClose?.();
  }

  function handleDelete(id: string) {
    deleteConversation(id);
    if (activeConversationId === id) {
      router.push("/app");
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* ── Top bar ── */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-sidebar-border",
            collapsed ? "h-14 justify-center px-0" : "h-14 justify-between px-4"
          )}
        >
          {!collapsed && (
            <Link href="/app" className="flex items-center">
              <NexaLogo size={24} showText />
            </Link>
          )}

          {collapsed && (
            <Link href="/app">
              <NexaLogo size={24} showText={false} />
            </Link>
          )}

          {/* Mobile close button */}
          {onClose && !collapsed && (
            <button
              aria-label="Close sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── New Chat button ── */}
        <div className={cn("shrink-0 px-3 py-3", collapsed && "flex justify-center px-2")}>
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  aria-label="New chat"
                  onClick={handleNewChat}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-nexa-violet/10 text-nexa-violet hover:bg-nexa-violet/20 transition-colors"
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                New chat
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleNewChat}
              className="flex w-full items-center gap-2.5 rounded-lg bg-nexa-violet/10 px-3 py-2 text-sm font-medium text-nexa-violet hover:bg-nexa-violet/20 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>New chat</span>
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav
          className={cn(
            "shrink-0 px-3 pb-1",
            collapsed && "flex flex-col items-center gap-0.5 px-2"
          )}
        >
          {collapsed ? (
            NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                collapsed
                active={
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href)
                }
              />
            ))
          ) : (
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  {...item}
                  collapsed={false}
                  active={
                    item.href === "/app"
                      ? pathname === "/app"
                      : pathname.startsWith(item.href)
                  }
                />
              ))}
            </div>
          )}
        </nav>

        {/* ── Conversation list (expanded only) ── */}
        {!collapsed && (
          <>
            <Separator className="mx-3 shrink-0 my-1" />

            {/* Search */}
            <div className="shrink-0 px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search chats…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-sidebar-border bg-sidebar-hover/50",
                    "py-1.5 pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-1 focus:ring-nexa-violet/40 transition-all"
                  )}
                />
                {searchQuery && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversation lists */}
            <ScrollArea className="flex-1 min-h-0 px-3">
              <div className="pb-4">
                {isSearching ? (
                  <>
                    <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      Results ({filteredConversations.length})
                    </p>
                    {filteredConversations.length === 0 ? (
                      <p className="px-1 py-3 text-center text-[13px] text-muted-foreground">
                        No conversations found
                      </p>
                    ) : (
                      filteredConversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          id={conv.id}
                          title={conv.title}
                          updatedAt={conv.updatedAt}
                          isPinned={conv.isPinned}
                          isActive={conv.id === activeConversationId}
                          onPin={togglePin}
                          onDelete={handleDelete}
                          onClick={handleConversationClick}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {/* Pinned */}
                    {pinnedConversations.length > 0 && (
                      <div className="mb-3">
                        <div className="mb-1 flex items-center gap-1.5 px-1">
                          <Pin className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            Pinned
                          </span>
                        </div>
                        {pinnedConversations.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            id={conv.id}
                            title={conv.title}
                            updatedAt={conv.updatedAt}
                            isPinned={conv.isPinned}
                            isActive={conv.id === activeConversationId}
                            onPin={togglePin}
                            onDelete={handleDelete}
                            onClick={handleConversationClick}
                          />
                        ))}
                      </div>
                    )}

                    {/* Recent */}
                    {recentConversations.length > 0 && (
                      <div>
                        <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                          Recent
                        </p>
                        {recentConversations.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            id={conv.id}
                            title={conv.title}
                            updatedAt={conv.updatedAt}
                            isPinned={conv.isPinned}
                            isActive={conv.id === activeConversationId}
                            onPin={togglePin}
                            onDelete={handleDelete}
                            onClick={handleConversationClick}
                          />
                        ))}
                      </div>
                    )}

                    {pinnedConversations.length === 0 && recentConversations.length === 0 && (
                      <p className="px-1 py-4 text-center text-[13px] text-muted-foreground">
                        No conversations yet
                      </p>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </>
        )}

        {/* ── Collapsed: spacer to push bottom section down ── */}
        {collapsed && <div className="flex-1" />}

        {/* ── Bottom section ── */}
        <div
          className={cn(
            "shrink-0 border-t border-sidebar-border",
            collapsed ? "flex flex-col items-center gap-1 py-3 px-2" : "px-3 py-3"
          )}
        >
          {/* Settings */}
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="/app/settings"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    pathname.startsWith("/app/settings")
                      ? "bg-nexa-violet/10 text-nexa-violet"
                      : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
                  )}
                >
                  <Settings className="h-[18px] w-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/app/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-2",
                pathname.startsWith("/app/settings")
                  ? "bg-nexa-violet/10 text-nexa-violet"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </Link>
          )}

          {/* User info (expanded only) */}
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-sidebar-hover transition-colors cursor-pointer">
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-nexa-violet/20">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="text-[11px] font-semibold bg-nexa-violet/10 text-nexa-violet">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium leading-tight">{user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground leading-tight">{user.email}</p>
              </div>
              <Badge
                className={cn(
                  "text-[10px] px-1.5 py-0.5 border capitalize shrink-0",
                  PLAN_STYLES[user.plan] ?? PLAN_STYLES.free
                )}
                variant="outline"
              >
                {user.plan}
              </Badge>
            </div>
          )}

          {/* Collapse/Expand toggle */}
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  aria-label="Expand sidebar"
                  onClick={() => setSidebarCollapsed(false)}
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              aria-label="Collapse sidebar"
              onClick={() => setSidebarCollapsed(true)}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── Main Sidebar export ───────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, isMobile, toggleSidebar } = useAppStore();

  // ── Mobile drawer ──
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Drawer panel */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[260px] bg-sidebar-bg border-r border-sidebar-border",
            "transition-transform duration-300 ease-in-out shadow-2xl",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Navigation sidebar"
        >
          <SidebarContent collapsed={false} onClose={toggleSidebar} />
        </aside>
      </>
    );
  }

  // ── Desktop sidebar ──
  if (!sidebarOpen) return null;

  return (
    <aside
      className={cn(
        "relative flex-shrink-0 bg-sidebar-bg border-r border-sidebar-border",
        "transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "w-[68px]" : "w-[260px]"
      )}
      aria-label="Navigation sidebar"
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </aside>
  );
}
