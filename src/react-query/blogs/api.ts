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

export const BlogEndpoints = {
  getBlogs: () => fetcher<BlogFormValues[]>("/api/blogs"),
  getBlog: (id: string) => fetcher<BlogFormValues>(`/api/blogs/${id}`),
  createBlog: (data: Partial<BlogFormValues>) => fetcher<BlogFormValues>("/api/blogs", { method: "POST", body: JSON.stringify(data) }),
  updateBlog: (id: string, data: Partial<BlogFormValues>) =>
    fetcher<BlogFormValues>(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateBlogStatus: (id: string, status: Status) => {
    return fetcher(`/api/blogs?status=${status}&id=${id}`, {
      method: "PUT",
    });
  },
  deleteBlog: (id: string) => fetcher<void>(`/api/blogs/${id}`, { method: "DELETE" }),
};
