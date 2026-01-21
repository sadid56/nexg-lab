"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { THEME_COLORS, useConfigStore } from "@/store/useConfigStore";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  function ThemeColorManager() {
    const { themeColor } = useConfigStore();

    React.useEffect(() => {
      const root = document.documentElement;
      const colors = THEME_COLORS[themeColor] || THEME_COLORS.orange;
      root.style.setProperty("--theme-primary", colors.primary);
      root.style.setProperty("--theme-secondary", colors.secondary);
    }, [themeColor]);

    return null;
  }
  return (
    <NextThemesProvider {...props}>
      {children}
      <ThemeColorManager />
    </NextThemesProvider>
  );
}
