import { GetBlogs } from "@/actions/blog-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import BlogCard from "./_components/BlogCard";
import { TBlog } from "@/types/blog-types";

export default async function Home() {
  const queryClient = new QueryClient();

  const blogs: TBlog[] = await queryClient.fetchQuery({
    queryKey: ["blogs"],
    queryFn: () => GetBlogs(),
    staleTime: 15 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {blogs?.map((blog: TBlog) => (
        <BlogCard post={blog} key={blog?.id} />
      ))}
    </HydrationBoundary>
  );
}
