"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomization, ShortcutKeys } from "@/providers/CustomizationProvider";
import { useTheme } from "next-themes";
import { Settings2, Monitor, Code2, Layout, Moon, Sun, MonitorDot, MoveVertical, Keyboard, Type } from "lucide-react";
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
    <div className="p-4 bg-orange-500/10">
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
    sidebarGap,
    setSidebarGap,
    shortcutKeys,
    setShortcutKeys,
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
  } = useCustomization();

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
      <DialogContent className='sm:max-w-[1200px] max-w-full h-screen max-h-screen overflow-y-auto overflow-x-hidden border-none p-0 shadow-3xl bg-background/95 backdrop-blur-2xl transition-all duration-300 rounded-none'>
        <div className='p-8 pb-16 relative min-h-full'>
          {/* Subtle background glow */}
          <div className='absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full' />
          <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full' />

          {/* Header with icon and title */}
          <div className='mb-8 relative z-10 text-left'>
            <div className='flex items-center gap-4'>
              <div className='rounded-[1.25rem] bg-linear-to-br from-orange-500 to-amber-500 p-3 text-white shadow-xl shadow-orange-500/20'>
                <Settings2 className='h-6 w-6' />
              </div>
              <div className='space-y-1'>
                <h2 className='text-2xl font-bold tracking-tight'>Personalize Your Lab</h2>
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
                  <Monitor className='h-4 w-4 text-orange-500' />
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
                          isActive ? "bg-background shadow-lg text-orange-500" : "hover:bg-background/50 text-muted-foreground",
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
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Layout className='h-4 w-4 text-orange-500' />
                  Layout
                </Label>
                <div className='space-y-3'>
                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300",
                      isZenMode ? "border-orange-500/50 bg-orange-500/5 shadow-inner" : "border-transparent bg-muted/30 hover:bg-muted/50",
                    )}
                    onClick={() => setIsZenMode(!isZenMode)}
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-bold'>Zen Mode</p>
                        <Kbd className='bg-orange-500/10 text-orange-600 border-none'>Shift+{shortcutKeys.zenMode}</Kbd>
                      </div>
                      <p className='text-xs text-muted-foreground font-medium'>Distraction-free focus.</p>
                    </div>
                    <Checkbox checked={isZenMode} onCheckedChange={(checked) => setIsZenMode(!!checked)} />
                  </div>

                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300",
                      isRightSidebarHidden
                        ? "border-orange-500/50 bg-orange-500/5 shadow-inner"
                        : "border-transparent bg-muted/30 hover:bg-muted/50",
                    )}
                    onClick={() => setIsRightSidebarHidden(!isRightSidebarHidden)}
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-bold'>Clean View</p>
                        <Kbd className='bg-orange-500/10 text-orange-600 border-none'>Shift+{shortcutKeys.sidebar}</Kbd>
                      </div>
                      <p className='text-xs text-muted-foreground font-medium'>Hide right controls.</p>
                    </div>
                    <Checkbox checked={isRightSidebarHidden} onCheckedChange={(checked) => setIsRightSidebarHidden(!!checked)} />
                  </div>
                </div>
              </div>

              {/* Typography Settings */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Type className='h-4 w-4 text-orange-500' />
                  Typography
                </Label>
                <div className='p-4 rounded-2xl bg-muted/30 border border-muted/50 space-y-4'>
                  {/* H1 Size */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>H1 Size</span>
                      <span className='text-xs font-bold text-orange-500'>{fontSizeH1}px</span>
                    </div>
                    <input
                      type='range'
                      min='32'
                      max='64'
                      step='2'
                      value={fontSizeH1}
                      onChange={(e) => setFontSizeH1(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>

                  {/* H2 Size */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>H2 Size</span>
                      <span className='text-xs font-bold text-orange-500'>{fontSizeH2}px</span>
                    </div>
                    <input
                      type='range'
                      min='24'
                      max='48'
                      step='2'
                      value={fontSizeH2}
                      onChange={(e) => setFontSizeH2(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>

                  {/* H3 Size */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>H3 Size</span>
                      <span className='text-xs font-bold text-orange-500'>{fontSizeH3}px</span>
                    </div>
                    <input
                      type='range'
                      min='20'
                      max='36'
                      step='2'
                      value={fontSizeH3}
                      onChange={(e) => setFontSizeH3(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>

                  {/* Body Text Size */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>Body Text</span>
                      <span className='text-xs font-bold text-orange-500'>{fontSizeP}px</span>
                    </div>
                    <input
                      type='range'
                      min='14'
                      max='24'
                      step='1'
                      value={fontSizeP}
                      onChange={(e) => setFontSizeP(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar Spacing */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <MoveVertical className='h-4 w-4 text-orange-500' />
                  Section Spacing
                </Label>
                <div className='p-4 rounded-2xl bg-muted/30 border border-muted/50 space-y-4'>
                  {/* Sidebar Gap */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>Sidebar Gap</span>
                      <span className='text-xs font-bold text-orange-500'>{sidebarGap}px</span>
                    </div>
                    <input
                      type='range'
                      min='10'
                      max='60'
                      step='5'
                      value={sidebarGap}
                      onChange={(e) => setSidebarGap(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>

                  {/* Section Separation */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60'>
                        Vertical Rhythm
                      </span>
                      <span className='text-xs font-bold text-orange-500'>{sectionSpacing}px</span>
                    </div>
                    <input
                      type='range'
                      min='16'
                      max='64'
                      step='4'
                      value={sectionSpacing}
                      onChange={(e) => setSectionSpacing(parseInt(e.target.value))}
                      className='w-full h-1.5 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-8'>
              {/* Keyboard Shortcuts Rebinding */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                  <Keyboard className='h-4 w-4 text-orange-500' />
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
                            "h-8 rounded-lg font-mono text-sm transition-all duration-300 min-w-16 border border-transparent hover:border-orange-500/20",
                            isFocus ? "bg-orange-500 text-white animate-pulse" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {isFocus ? "..." : `Shift+${shortcutKeys[key]}`}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Syntax Highlighting Theme */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label className='flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest'>
                    <Code2 className='h-4 w-4 text-orange-500' />
                    Code Theme
                  </Label>
                  <Kbd className='bg-orange-500/10 text-orange-600 border-none'>Shift+{shortcutKeys.tweakDialog}</Kbd>
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
                          className='rounded-lg focus:bg-orange-500/10 transition-colors py-2.5 font-medium'
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

              {/* Hint Card */}
              <div className='p-5 rounded-2xl bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/20'>
                <p className='text-xs font-medium text-orange-600 dark:text-orange-400 leading-relaxed'>
                  All settings are saved automatically and synced across your sessions. <br />
                  <br />
                  Try the <span className='font-bold'>shortcuts</span> to customize while reading!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
