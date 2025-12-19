import { GetRecentBlog } from "@/actions/blog-actions";
import { CACHE_TIME } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";

const useRecentBlogs = (enabled = true) => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["recent-blogs"],
    queryFn: () => GetRecentBlog(),
    staleTime: CACHE_TIME[10],
    enabled,
  });
  return { blogs, isLoading };
};

export default useRecentBlogs;
