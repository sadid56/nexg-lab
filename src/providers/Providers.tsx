"use client";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConfigStore } from "@/store/useConfigStore";
import { TweakDialog } from "@/components/global/TweakDialog";

import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

function TweakManager() {
  const { showTweakDialog, setShowTweakDialog, shortcutKeys, toggleZenMode, toggleRightSidebar } = useConfigStore();

  useKeyboardShortcut({ key: shortcutKeys.tweakDialog, shiftKey: true }, () => setShowTweakDialog(!showTweakDialog));
  useKeyboardShortcut({ key: shortcutKeys.zenMode, shiftKey: true }, () => toggleZenMode());
  useKeyboardShortcut({ key: shortcutKeys.sidebar, shiftKey: true }, () => toggleRightSidebar());

  return <TweakDialog open={showTweakDialog} onOpenChange={setShowTweakDialog} />;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <TweakManager />
    </QueryClientProvider>
  );
}
