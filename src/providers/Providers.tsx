"use client";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomizationProvider, useCustomization } from "./CustomizationProvider";
import { TweakDialog } from "@/components/layouts/_components/TweakDialog";

function TweakManager() {
  const { showTweakDialog, setShowTweakDialog } = useCustomization();
  return <TweakDialog open={showTweakDialog} onOpenChange={setShowTweakDialog} />;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
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
      <CustomizationProvider>
        {children}
        <TweakManager />
      </CustomizationProvider>
    </QueryClientProvider>
  );
}
