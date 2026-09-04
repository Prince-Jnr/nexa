"use client";

import * as React from "react";
import { useAppStore } from "@/stores/app-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";
import { useChatStore } from "@/stores/chat-store";

const MOBILE_BREAKPOINT = 768;
const subscribeToViewport = () => () => {};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { setIsMobile, setUser, user } = useAppStore();
  const viewportReady = React.useSyncExternalStore(
    subscribeToViewport,
    () => true,
    () => false
  );

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

  if (!viewportReady) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex h-full min-h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="min-w-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
