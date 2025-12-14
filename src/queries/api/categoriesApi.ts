import { fetcher } from "@/lib/fetcher";
import { Category } from "@/types/category-types";

export const getCategories = () => fetcher<Category[]>("/api/categories");

export const createCategory = (data: Partial<Category>) =>
  fetcher<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCategory = (id: string, data: Partial<Category>) =>
  fetcher<Category>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCategory = (id: string) =>
  fetcher<void>(`/api/categories/${id}`, {
    method: "DELETE",
  });
