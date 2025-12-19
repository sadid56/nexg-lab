"use client";

import { GetCurrentUser } from "@/actions/auth-actions";
import { CACHE_TIME } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = ({ enabled = true }: { enabled?: boolean }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await GetCurrentUser();
      return res ?? null;
    },
    staleTime: CACHE_TIME[10],
    enabled,
  });
  return { user, isLoading, error };
};

export default useCurrentUser;
