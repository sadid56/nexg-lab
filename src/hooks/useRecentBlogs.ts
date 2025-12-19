import { GetRecentBlog } from "@/actions/blog-actions";
import { CACHE_TIME } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";

const useRecentBlogs = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => GetRecentBlog(),
    staleTime: CACHE_TIME[10],
  });
  return { blogs, isLoading };
};

export default useRecentBlogs;
