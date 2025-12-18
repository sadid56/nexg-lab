"use client";

import { GetCurrentUser } from "@/actions/auth-actions";
import { CACHE_TIME } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
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
  });
  return { user, isLoading, error };
};

export default useCurrentUser;
