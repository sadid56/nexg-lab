import { fetcher } from "@/lib/fetcher";
import { Category } from "@/types/category-types";

export const CategoryEndpoints = {
  getCategories: () => fetcher<Category[]>("/api/categories"),
  createCategory: (data: Partial<Category>) =>
    fetcher<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: Partial<Category>) =>
    fetcher<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    fetcher<void>(`/api/categories/${id}`, {
      method: "DELETE",
    }),
};
