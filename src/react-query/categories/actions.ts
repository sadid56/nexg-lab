import { useAppMutation } from "@/hooks/useAppMutation";
import { CategoryEndpoints } from "./api";
import { categoryKeys } from "./keys";
import { Category } from "@/types/category-types";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: CategoryEndpoints.getCategories,
  });
}

export const useCreateCategory = () =>
  useAppMutation<Partial<Category>>({
    mutationFn: CategoryEndpoints.createCategory,
    invalidateKeys: [categoryKeys.all],
    successMessage: "Category created successfully",
    errorMessage: "Failed to create category",
  });

export const useUpdateCategory = (id: string) =>
  useAppMutation<Partial<Category>>({
    mutationFn: (data) => CategoryEndpoints.updateCategory(id, data),
    invalidateKeys: [categoryKeys.all],
    successMessage: "Category updated successfully",
    errorMessage: "Failed to update category",
  });

export const useDeleteCategory = () =>
  useAppMutation<string>({
    mutationFn: CategoryEndpoints.deleteCategory,
    invalidateKeys: [categoryKeys.all],
    successMessage: "Category deleted successfully",
    errorMessage: "Failed to delete category",
  });
