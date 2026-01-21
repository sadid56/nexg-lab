"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfigStore, ShortcutKeys, THEME_COLORS, ThemeColorName } from "@/store/useConfigStore";
import { useTheme } from "next-themes";
import { Settings2, Monitor, Code2, Layout, Moon, Sun, MonitorDot, Keyboard, RotateCcw, Palette } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  atomDark,
  dracula,
  oneDark,
  nightOwl,
  shadesOfPurple,
  synthwave84,
  base16AteliersulphurpoolLight,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const syntaxThemes: Record<string, any> = {
  vscDarkPlus,
  atomDark,
  dracula,
  oneDark,
  nightOwl,
  shadesOfPurple,
  synthwave84,
  base16AteliersulphurpoolLight,
  prism,
};

const PREVIEW_CODE = `function LabExperiment() {
  const [data, setData] = useState(null);
  
  // Real-time customization test
  return (
    <div className="p-4 bg-theme-primary/10">
      <h1>Hello Lab!</h1>
    </div>
  );
}`;

export const TweakDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const {
    syntaxTheme,
    setSyntaxTheme,
    isZenMode,
    setIsZenMode,
    isRightSidebarHidden,
    setIsRightSidebarHidden,
    shortcutKeys,
    setShortcutKeys,
    themeColor,
    setThemeColor,
    resetSettings,
  } = useConfigStore();

  const isMobile = useIsMobile();

  const [isCapturing, setIsCapturing] = React.useState<keyof ShortcutKeys | null>(null);

  React.useEffect(() => {
    if (!isCapturing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key.toUpperCase();
      // Only capture single characters/numbers and avoid modifiers
      if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setShortcutKeys({ ...shortcutKeys, [isCapturing]: key });
        setIsCapturing(null);
      }
      if (e.key === "Escape") setIsCapturing(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCapturing, shortcutKeys, setShortcutKeys]);

  const { theme, setTheme } = useTheme();

  const themes = [
    { label: "VS Code Dark Plus", value: "vscDarkPlus" },
    { label: "Atom Dark", value: "atomDark" },
    { label: "Dracula", value: "dracula" },
    { label: "One Dark", value: "oneDark" },
    { label: "Night Owl", value: "nightOwl" },
    { label: "Shades of Purple", value: "shadesOfPurple" },
    { label: "Synthwave '84", value: "synthwave84" },
    { label: "Base16 Light", value: "base16AteliersulphurpoolLight" },
    { label: "Prism Default", value: "prism" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-w-[95vw] h-auto max-h-[90vh] overflow-y-auto overflow-x-hidden border border-muted-foreground/10 p-0 shadow-3xl bg-background/95 backdrop-blur-2xl transition-all duration-300 rounded-4xl'>
        <DialogTitle className='sr-only' />
        <div className='p-4 md:p-8 relative'>
          {/* Subtle background glow */}
          <div className='absolute -top-24 -right-24 w-64 h-64 bg-theme-primary/10 blur-[100px] rounded-full' />
          <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-theme-secondary/10 blur-[100px] rounded-full' />

          {/* Header with icon and title */}
          <div className='mb-8 relative z-10 text-left'>
            <div className='flex items-center gap-4'>
              <div className='rounded-[1.25rem] bg-linear-to-br from-theme-primary to-theme-secondary p-3 text-white shadow-xl shadow-theme-primary/20'>
                <Settings2 className='h-6 w-6' />
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <div className='flex items-center gap-4'>
                  <h2 className='text-xl md:text-2xl font-bold tracking-tight'>Personalize Your Lab</h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={resetSettings}
                    className='h-8 px-3 rounded-lg border border-theme-primary/20 bg-theme-primary/10 hover:text-theme-primary transition-all duration-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5'
                  >
                    <RotateCcw className='h-3.5 w-3.5' />
                    Reset Settings
                  </Button>
                </div>
                <p className='text-sm text-balance text-muted-foreground font-medium'>
                  Customize your workspace for the ultimate reading experience.
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10'>
            <div className='space-y-8'>
              {/* Website Theme */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Monitor className='h-4 w-4 text-theme-primary' />
                  Appearance
                </Label>
                <div className='grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-muted/30 border border-muted/50'>
                  {(["light", "dark", "system"] as const).map((t) => {
                    const icons = { light: Sun, dark: Moon, system: MonitorDot };
                    const Icon = icons[t];
                    const isActive = theme === t;
                    return (
                      <Button
                        key={t}
                        variant='ghost'
                        size='sm'
                        onClick={() => setTheme(t)}
                        className={cn(
                          "flex h-14 flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300",
                          isActive ? "bg-background shadow-lg text-theme-primary" : "hover:bg-background/50 text-muted-foreground",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "scale-110" : "")} />
                        <span className='text-[10px] font-bold uppercase tracking-wider'>{t}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Options */}
              <div className='space-y-4 hidden lg:block'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Layout className='h-4 w-4 text-theme-primary' />
                  Layout
                </Label>
                <div className='space-y-3'>
                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300",
                      isZenMode
                        ? "border-theme-primary/50 bg-theme-primary/5 shadow-inner"
                        : "border-transparent bg-muted/30 hover:bg-muted/50",
                    )}
                    onClick={() => setIsZenMode(!isZenMode)}
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-bold'>Zen Mode</p>
                        <Kbd className='bg-theme-primary/10 text-theme-primary border-none'>Shift+{shortcutKeys.zenMode}</Kbd>
                      </div>
                      <p className='text-xs text-muted-foreground font-medium'>Distraction-free focus.</p>
                    </div>
                    <Checkbox checked={isZenMode} onCheckedChange={(checked) => setIsZenMode(!!checked)} />
                  </div>

                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300",
                      isRightSidebarHidden
                        ? "border-theme-primary/50 bg-theme-primary/5 shadow-inner"
                        : "border-transparent bg-muted/30 hover:bg-muted/50",
                    )}
                    onClick={() => setIsRightSidebarHidden(!isRightSidebarHidden)}
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-bold'>Clean View</p>
                        <Kbd className='bg-theme-primary/10 text-theme-primary border-none'>Shift+{shortcutKeys.sidebar}</Kbd>
                      </div>
                      <p className='text-xs text-muted-foreground font-medium'>Hide right controls.</p>
                    </div>
                    <Checkbox checked={isRightSidebarHidden} onCheckedChange={(checked) => setIsRightSidebarHidden(!!checked)} />
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Palette className='h-4 w-4 text-theme-primary' />
                  Brand Color
                </Label>
                <div className='flex flex-wrap gap-3 p-4 rounded-2xl bg-muted/30 border border-muted/50'>
                  {(Object.keys(THEME_COLORS) as ThemeColorName[]).map((name) => (
                    <button
                      key={name}
                      onClick={() => setThemeColor(name)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all duration-300 relative group",
                        themeColor === name
                          ? "border-theme-primary shadow-lg scale-110"
                          : "border-transparent hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600",
                      )}
                      style={{ backgroundColor: THEME_COLORS[name].primary }}
                      title={name}
                    >
                      {themeColor === name && (
                        <span className='absolute inset-0 flex items-center justify-center'>
                          <span className='w-1.5 h-1.5 rounded-full bg-white shadow-xs' />
                        </span>
                      )}
                      <span className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='space-y-8'>
              {/* Keyboard Shortcuts Rebinding */}
              {!isMobile && (
                <div className='space-y-4'>
                  <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                    <Keyboard className='h-4 w-4 text-theme-primary' />
                    customized Shortcuts
                  </Label>
                  <div className='grid grid-cols-1 gap-2 p-4 rounded-2xl bg-muted/30 border border-muted/50'>
                    {(Object.keys(shortcutKeys) as Array<keyof ShortcutKeys>).map((key) => {
                      const labels: Record<keyof ShortcutKeys, string> = {
                        tweakDialog: "Tweak Menu",
                        zenMode: "Zen Mode",
                        sidebar: "Clean View",
                      };
                      const isFocus = isCapturing === key;
                      return (
                        <div
                          key={key}
                          className='flex items-center justify-between p-3 rounded-xl bg-background/50 border border-muted-foreground/10'
                        >
                          <span className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>{labels[key]}</span>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setIsCapturing(key)}
                            className={cn(
                              "h-8 rounded-lg font-mono text-sm transition-all duration-300 min-w-16 border border-transparent hover:border-theme-primary/20",
                              isFocus ? "bg-theme-primary text-white animate-pulse" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {isFocus ? "..." : `Shift+${shortcutKeys[key]}`}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Syntax Highlighting Theme */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                    <Code2 className='h-4 w-4 text-theme-primary' />
                    Code Theme
                  </Label>
                  <Kbd className='bg-theme-primary/10 text-theme-primary border-none'>Shift+{shortcutKeys.tweakDialog}</Kbd>
                </div>
                <div className='p-4 rounded-2xl bg-muted/30 border border-muted/50 space-y-4'>
                  <Select value={syntaxTheme} onValueChange={setSyntaxTheme}>
                    <SelectTrigger className='w-full rounded-xl border-none bg-background shadow-sm hover:shadow-md transition-all h-12 px-4 font-medium'>
                      <SelectValue placeholder='Select a theme' />
                    </SelectTrigger>
                    <SelectContent className='rounded-2xl border shadow-2xl overflow-hidden'>
                      {themes.map((t) => (
                        <SelectItem
                          key={t.value}
                          value={t.value}
                          className='rounded-lg focus:bg-theme-primary/10 transition-colors py-2.5 font-medium'
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className='rounded-xl overflow-hidden border border-muted-foreground/20 bg-background/50'>
                    <div className='flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-muted-foreground/10'>
                      <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 italic'>
                        Live Preview
                      </p>
                      <div className='flex gap-1'>
                        <div className='w-2 h-2 rounded-full bg-red-400' />
                        <div className='w-2 h-2 rounded-full bg-amber-400' />
                        <div className='w-2 h-2 rounded-full bg-emerald-400' />
                      </div>
                    </div>
                    <div className='max-h-[160px] overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
                      <SyntaxHighlighter
                        language='javascript'
                        style={syntaxThemes[syntaxTheme] || vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          background: "transparent",
                          fontSize: "11px",
                          lineHeight: "1.5",
                        }}
                      >
                        {PREVIEW_CODE}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
