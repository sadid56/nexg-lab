import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";
import { KeywordEndpoints } from "./api";
import { keywordsKeys } from "./keys";
import { Keyword } from "@/types/keywords-types";

export function useKeywords() {
  return useQuery({
    queryKey: keywordsKeys.lists(),
    queryFn: KeywordEndpoints.getKeywords,
  });
}

export function useCreateKeyword() {
  return useAppMutation<Partial<Keyword>>({
    mutationFn: KeywordEndpoints.createKeyword,
    invalidateKeys: [["keywords"]],
    successMessage: "Keyword created successfully",
    errorMessage: "Failed to create keyword",
  });
}

export function useUpdateKeyword() {
  return useAppMutation<{ id: string; data: Partial<Keyword> }>({
    mutationFn: ({ id, data }) => KeywordEndpoints.updateKeyword(id, data),
    invalidateKeys: [["keywords"]],
    successMessage: "Keyword updated successfully",
    errorMessage: "Failed to update keyword",
  });
}

export function useDeleteKeyword() {
  return useAppMutation<string>({
    mutationFn: KeywordEndpoints.deleteKeyword,
    invalidateKeys: [["keywords"]],
    successMessage: "Keyword deleted successfully",
    errorMessage: "Failed to delete keyword",
  });
}
