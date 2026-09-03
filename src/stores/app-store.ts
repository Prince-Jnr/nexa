import { create } from "zustand";
import type { User } from "@/types";

interface AppState {
  user: User | null;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  selectedModel: string;
  theme: "light" | "dark" | "system";
  isMobile: boolean;
  commandPaletteOpen: boolean;

  setUser: (user: User | null) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedModel: (model: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setIsMobile: (isMobile: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarOpen: true,
  sidebarCollapsed: false,
  selectedModel: "nexa-pro",
  theme: "dark",
  isMobile: false,
  commandPaletteOpen: false,

  setUser: (user) => set({ user }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setTheme: (theme) => set({ theme }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
