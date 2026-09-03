"use client";

import * as React from "react";
import { useAppStore } from "@/stores/app-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";
import { useChatStore } from "@/stores/chat-store";

const MOBILE_BREAKPOINT = 768;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { setIsMobile, setUser, user } = useAppStore();

  // Detect mobile and wire up a resize listener
  React.useEffect(() => {
    setUser(getCurrentUser());

    function handleResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }

    // Set immediately on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile, setUser]);

  React.useEffect(() => {
    if (user) void useChatStore.persist.rehydrate();
  }, [user]);

  return (
    <div className="flex h-full min-h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
