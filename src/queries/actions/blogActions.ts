import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/blogsApi";
import { blogKeys } from "../keys/blogsKeys";
import { Status } from "@/theme/status-badge";

export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: api.getBlogs,
  });
}

export function useGetBlogById(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => api.getBlog(id),
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createBlogs,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: blogKeys.all,
      });
    },
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBlogs(id, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: blogKeys.all,
      });
    },
  });
}

export function useUpdateBlogStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => api.updateBlogStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: blogKeys.all,
      });
    },
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteBlogs,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: blogKeys.all,
      });
    },
  });
}
