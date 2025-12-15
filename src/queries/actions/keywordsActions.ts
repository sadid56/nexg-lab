import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/keywordsApi";
import { keywordsKeys } from "../keys/keywordsKeys";

export function useKeywords() {
  return useQuery({
    queryKey: keywordsKeys.lists(),
    queryFn: api.getKeywords,
  });
}

export function useCreateKeyword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createKeyword,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: keywordsKeys.all,
      });
    },
  });
}

export function useUpdateKeyword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateKeyword(id, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: keywordsKeys.all,
      });
    },
  });
}

export function useDeleteKeyword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteKeyword,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: keywordsKeys.all,
      });
    },
  });
}
