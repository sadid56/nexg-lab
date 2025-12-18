import { fetcher } from "@/lib/fetcher";
import { Status } from "@/theme/status-badge";

export interface BlogFormValues {
  title: string;
  slug: string;
  descriptions: string;
  category: string;
  tags: string[];
  content: string;
}

export const getBlogs = () => fetcher<BlogFormValues[]>("/api/blogs");

export const getBlog = (id: string) => fetcher<BlogFormValues>(`/api/blogs/${id}`);

export const createBlogs = (data: Partial<BlogFormValues>) =>
  fetcher<BlogFormValues>("/api/blogs", { method: "POST", body: JSON.stringify(data) });

export const updateBlogs = (id: string, data: Partial<BlogFormValues>) =>
  fetcher<BlogFormValues>(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const updateBlogStatus = (id: string, status: Status) => {
  return fetcher(`/api/blogs?status=${status}&id=${id}`, {
    method: "PUT",
  });
};

export const deleteBlogs = (id: string) => fetcher<void>(`/api/blogs/${id}`, { method: "DELETE" });
