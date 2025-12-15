import { fetcher } from "@/lib/fetcher";
import { Status } from "@/theme/status-badge";
import { BlogRootSettings, BlogSection } from "@/types/blog-types";

interface BlogForm {
  root: BlogRootSettings;
  sections: BlogSection[];
}
export const getBlogs = () => fetcher<BlogForm[]>("/api/blogs");

export const getBlog = (id: string) => fetcher<BlogForm[]>(`/api/blogs/${id}`);

export const createBlogs = (data: Partial<BlogForm>) => fetcher<BlogForm>("/api/blogs", { method: "POST", body: JSON.stringify(data) });

export const updateBlogs = (id: string, data: Partial<BlogForm>) =>
  fetcher<BlogForm>(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const updateBlogStatus = (id: string, status: Status) => {
  return fetcher(`/api/blogs?status=${status}&id=${id}`, {
    method: "PUT",
  });
};

export const deleteBlogs = (id: string) => fetcher<void>(`/api/blogs/${id}`, { method: "DELETE" });
