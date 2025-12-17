import { GetAllBlogSlugs, GetBlogDetails } from "@/actions/blog-actions";
import { RouteParams } from "@/types/next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import BlogDetails from "../../_components/BlogDetails";
import { notFound } from "next/navigation";
import { TBlog } from "@/types/blog-types";

export async function generateStaticParams() {
  const slugs = await GetAllBlogSlugs();

  return slugs.map((s) => ({
    slug: s.slug,
  }));
}

const BlogReadPage = async ({ params }: RouteParams<"slug">) => {
  const { slug } = await params;
  const queryClient = new QueryClient();

  const blog: TBlog = await queryClient.fetchQuery({
    queryKey: ["blog", slug],
    queryFn: () => GetBlogDetails(slug),
    staleTime: 15 * 60 * 1000,
  });

  if (!blog) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetails blog={blog} />
    </HydrationBoundary>
  );
};

export default BlogReadPage;
