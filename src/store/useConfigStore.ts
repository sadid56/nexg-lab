import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ShortcutKeys {
  tweakDialog: string;
  zenMode: string;
  sidebar: string;
}

export const TYPOGRAPHY = {
  h1: "text-3xl md:text-5xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight mt-12 mb-6",
  h2: "text-2xl md:text-4xl font-bold pb-3 border-b-2 border-gradient-to-r from-primary/50 to-transparent mt-10 mb-5",
  h3: "text-xl md:text-3xl font-semibold text-foreground/90 mt-8 mb-4",
  h4: "text-lg md:text-2xl font-semibold text-foreground/80 mt-6 mb-3",
  h5: "text-base md:text-xl font-semibold text-foreground/75 mt-5 mb-2.5",
  h6: "text-sm md:text-lg font-semibold text-foreground/70 mt-4 mb-2",
  p: "text-base md:text-lg text-foreground/80 leading-relaxed mb-6",
  link: "flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-blue-600/30 hover:decoration-blue-600 underline-offset-2 transition-all font-medium group",
  title: "text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",
  description:
    "mb-10 p-6 rounded-2xl bg-theme-primary/5 border border-theme-primary/10 italic text-lg text-gray-700 dark:text-gray-300 leading-relaxed",
};

export const THEME_COLORS = {
  orange: { primary: "#f97316", secondary: "#f59e0b" },
  blue: { primary: "#3b82f6", secondary: "#06b6d4" },
  green: { primary: "#22c55e", secondary: "#10b981" },
  purple: { primary: "#a855f7", secondary: "#ec4899" },
  rose: { primary: "#e11d48", secondary: "#fb7185" },
  cyan: { primary: "#0891b2", secondary: "#06b6d4" },
  indigo: { primary: "#4f46e5", secondary: "#6366f1" },
} as const;

export type ThemeColorName = keyof typeof THEME_COLORS;

interface ConfigState {
  syntaxTheme: string;
  isZenMode: boolean;
  isRightSidebarHidden: boolean;
  shortcutKeys: ShortcutKeys;
  showTweakDialog: boolean;
  themeColor: ThemeColorName;
  _hasHydrated: boolean;

  // Actions
  setHasHydrated: (state: boolean) => void;
  setShowTweakDialog: (show: boolean) => void;
  setSyntaxTheme: (theme: string) => void;
  setIsZenMode: (isZen: boolean) => void;
  toggleZenMode: () => void;
  setIsRightSidebarHidden: (isHidden: boolean) => void;
  toggleRightSidebar: () => void;
  setShortcutKeys: (keys: ShortcutKeys) => void;
  setThemeColor: (color: ThemeColorName) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  syntaxTheme: "vscDarkPlus",
  isZenMode: false,
  isRightSidebarHidden: false,
  shortcutKeys: { tweakDialog: "A", zenMode: "Z", sidebar: "B" },
  showTweakDialog: false,
  themeColor: "orange" as ThemeColorName,
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setShowTweakDialog: (showTweakDialog) => set({ showTweakDialog }),
      setSyntaxTheme: (syntaxTheme) => set({ syntaxTheme }),
      setIsZenMode: (isZenMode) => set({ isZenMode }),
      toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
      setIsRightSidebarHidden: (isRightSidebarHidden) => set({ isRightSidebarHidden }),
      toggleRightSidebar: () => set((state) => ({ isRightSidebarHidden: !state.isRightSidebarHidden })),
      setShortcutKeys: (shortcutKeys) => set({ shortcutKeys }),
      setThemeColor: (themeColor) => set({ themeColor }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "lab-config-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => {
        const { ...rest } = state;
        return rest;
      },
    },
  ),
);
