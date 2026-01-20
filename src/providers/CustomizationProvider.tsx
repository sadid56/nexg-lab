"use client";

import React, { createContext, useContext, useState } from "react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export interface ShortcutKeys {
  tweakDialog: string;
  zenMode: string;
  sidebar: string;
}

interface CustomizationContextType {
  syntaxTheme: string;
  setSyntaxTheme: (theme: string) => void;
  isZenMode: boolean;
  setIsZenMode: (isZen: boolean) => void;
  isRightSidebarHidden: boolean;
  setIsRightSidebarHidden: (isHidden: boolean) => void;
  showTweakDialog: boolean;
  setShowTweakDialog: (show: boolean) => void;
  sidebarGap: number;
  setSidebarGap: (gap: number) => void;
  shortcutKeys: ShortcutKeys;
  setShortcutKeys: (keys: ShortcutKeys) => void;
  toggleZenMode: () => void;
  toggleRightSidebar: () => void;
  fontSizeH1: number;
  setFontSizeH1: (size: number) => void;
  fontSizeH2: number;
  setFontSizeH2: (size: number) => void;
  fontSizeH3: number;
  setFontSizeH3: (size: number) => void;
  fontSizeP: number;
  setFontSizeP: (size: number) => void;
  sectionSpacing: number;
  setSectionSpacing: (spacing: number) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage directly in useState for efficiency and to avoid cascading renders
  const [syntaxTheme, setSyntaxThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("custom_syntax_theme") || "vscDarkPlus";
    }
    return "vscDarkPlus";
  });

  const [isZenMode, setIsZenModeState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("custom_zen_mode") === "true";
    }
    return false;
  });

  const [isRightSidebarHidden, setIsRightSidebarHiddenState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("custom_sidebar_hidden") === "true";
    }
    return false;
  });

  const [sidebarGap, setSidebarGapState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_sidebar_gap");
      return saved ? parseInt(saved, 10) : 20;
    }
    return 20;
  });

  const [shortcutKeys, setShortcutKeysState] = useState<ShortcutKeys>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_shortcut_keys");
      return saved ? JSON.parse(saved) : { tweakDialog: "A", zenMode: "Z", sidebar: "B" };
    }
    return { tweakDialog: "A", zenMode: "Z", sidebar: "B" };
  });

  const [fontSizeH1, setFontSizeH1State] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_font_size_h1");
      return saved ? parseInt(saved, 10) : 48;
    }
    return 48;
  });

  const [fontSizeH2, setFontSizeH2State] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_font_size_h2");
      return saved ? parseInt(saved, 10) : 30;
    }
    return 30;
  });

  const [fontSizeH3, setFontSizeH3State] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_font_size_h3");
      return saved ? parseInt(saved, 10) : 24;
    }
    return 24;
  });

  const [fontSizeP, setFontSizePState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_font_size_p");
      return saved ? parseInt(saved, 10) : 18;
    }
    return 18;
  });

  const [sectionSpacing, setSectionSpacingState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_section_spacing");
      return saved ? parseInt(saved, 10) : 24;
    }
    return 24;
  });

  const [showTweakDialog, setShowTweakDialog] = useState(false);

  const setSyntaxTheme = (theme: string) => {
    setSyntaxThemeState(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_syntax_theme", theme);
    }
  };

  const setIsZenMode = (isZen: boolean) => {
    setIsZenModeState(isZen);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_zen_mode", String(isZen));
    }
  };

  const setIsRightSidebarHidden = (isHidden: boolean) => {
    setIsRightSidebarHiddenState(isHidden);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_sidebar_hidden", String(isHidden));
    }
  };

  const setSidebarGap = (gap: number) => {
    setSidebarGapState(gap);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_sidebar_gap", String(gap));
    }
  };

  const setShortcutKeys = (keys: ShortcutKeys) => {
    setShortcutKeysState(keys);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_shortcut_keys", JSON.stringify(keys));
    }
  };

  const setFontSizeH1 = (size: number) => {
    setFontSizeH1State(size);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_font_size_h1", String(size));
    }
  };

  const setFontSizeH2 = (size: number) => {
    setFontSizeH2State(size);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_font_size_h2", String(size));
    }
  };

  const setFontSizeH3 = (size: number) => {
    setFontSizeH3State(size);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_font_size_h3", String(size));
    }
  };

  const setFontSizeP = (size: number) => {
    setFontSizePState(size);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_font_size_p", String(size));
    }
  };

  const setSectionSpacing = (spacing: number) => {
    setSectionSpacingState(spacing);
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_section_spacing", String(spacing));
    }
  };

  const resetSettings = () => {
    setSyntaxTheme("vscDarkPlus");
    setIsZenMode(false);
    setIsRightSidebarHidden(false);
    setSidebarGap(20);
    setShortcutKeys({ tweakDialog: "A", zenMode: "Z", sidebar: "B" });
    setFontSizeH1(48);
    setFontSizeH2(30);
    setFontSizeH3(24);
    setFontSizeP(18);
    setSectionSpacing(24);
  };

  const exportSettings = () => {
    const settings = {
      syntaxTheme,
      isZenMode,
      isRightSidebarHidden,
      sidebarGap,
      shortcutKeys,
      fontSizeH1,
      fontSizeH2,
      fontSizeH3,
      fontSizeP,
      sectionSpacing,
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lab-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const settings = JSON.parse(event.target?.result as string);
        if (settings.syntaxTheme) setSyntaxTheme(settings.syntaxTheme);
        if (settings.isZenMode !== undefined) setIsZenMode(settings.isZenMode);
        if (settings.isRightSidebarHidden !== undefined) setIsRightSidebarHidden(settings.isRightSidebarHidden);
        if (settings.sidebarGap) setSidebarGap(settings.sidebarGap);
        if (settings.shortcutKeys) setShortcutKeys(settings.shortcutKeys);
        if (settings.fontSizeH1) setFontSizeH1(settings.fontSizeH1);
        if (settings.fontSizeH2) setFontSizeH2(settings.fontSizeH2);
        if (settings.fontSizeH3) setFontSizeH3(settings.fontSizeH3);
        if (settings.fontSizeP) setFontSizeP(settings.fontSizeP);
        if (settings.sectionSpacing) setSectionSpacing(settings.sectionSpacing);
      } catch (error) {
        console.error("Failed to import settings:", error);
      }
    };
    reader.readAsText(file);
    // Reset input value to allow re-importing same file
    e.target.value = "";
  };

  const toggleZenMode = () => setIsZenMode(!isZenMode);
  const toggleRightSidebar = () => setIsRightSidebarHidden(!isRightSidebarHidden);

  // Keyboard Shortcuts
  useKeyboardShortcut({ key: shortcutKeys.tweakDialog, shiftKey: true }, () => setShowTweakDialog((prev) => !prev));
  useKeyboardShortcut({ key: shortcutKeys.zenMode, shiftKey: true }, () => toggleZenMode());
  useKeyboardShortcut({ key: shortcutKeys.sidebar, shiftKey: true }, () => toggleRightSidebar());

  return (
    <CustomizationContext.Provider
      value={{
        syntaxTheme,
        setSyntaxTheme,
        isZenMode,
        setIsZenMode,
        isRightSidebarHidden,
        setIsRightSidebarHidden,
        showTweakDialog,
        setShowTweakDialog,
        sidebarGap,
        setSidebarGap,
        shortcutKeys,
        setShortcutKeys,
        toggleZenMode,
        toggleRightSidebar,
        fontSizeH1,
        setFontSizeH1,
        fontSizeH2,
        setFontSizeH2,
        fontSizeH3,
        setFontSizeH3,
        fontSizeP,
        setFontSizeP,
        sectionSpacing,
        setSectionSpacing,
        resetSettings,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return context;
};
