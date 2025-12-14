import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/categoriesApi";
import { categoryKeys } from "../keys/categoryKeys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: api.getCategories,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
}
