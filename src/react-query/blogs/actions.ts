import { useAppMutation } from "@/hooks/useAppMutation";
import { BlogEndpoints, BlogFormValues } from "./api";
import { blogKeys } from "./keys";
import { Status } from "@/theme/status-badge";
import { useQuery } from "@tanstack/react-query";

export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: BlogEndpoints.getBlogs,
  });
}

export function useGetBlogById(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => BlogEndpoints.getBlog(id),
  });
}

export const useCreateBlog = () =>
  useAppMutation<Partial<BlogFormValues>>({
    mutationFn: BlogEndpoints.createBlog,
    invalidateKeys: [blogKeys.all],
    successMessage: "Blog created successfully",
    errorMessage: "Failed to create blog",
  });

export const useUpdateBlog = (id: string) =>
  useAppMutation<Partial<BlogFormValues>>({
    mutationFn: (data) => BlogEndpoints.updateBlog(id, data),
    invalidateKeys: [blogKeys.all],
    successMessage: "Blog updated successfully",
    errorMessage: "Failed to update blog",
  });

export const useUpdateBlogStatus = () =>
  useAppMutation<{ id: string; status: Status }>({
    mutationFn: ({ id, status }) => BlogEndpoints.updateBlogStatus(id, status),
    invalidateKeys: [blogKeys.all],
    successMessage: "Blog status updated successfully",
    errorMessage: "Failed to update blog status",
  });

export const useDeleteBlog = () =>
  useAppMutation<string>({
    mutationFn: BlogEndpoints.deleteBlog,
    invalidateKeys: [blogKeys.all],
    successMessage: "Blog deleted successfully",
    errorMessage: "Failed to delete blog",
  });
