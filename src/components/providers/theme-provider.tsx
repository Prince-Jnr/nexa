"use client";

import * as React from "react";
import { useAppStore } from "@/stores/app-store";

export function ThemeProvider({
  children,
}: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);

  React.useEffect(() => {
    const resolvedTheme = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [theme]);

  return <>{children}</>;
}
