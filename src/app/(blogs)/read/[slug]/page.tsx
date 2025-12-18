import { GetAllBlogSlugs } from "@/actions/blog-actions";
import { RouteParams } from "@/types/next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import BlogDetails from "../../_components/BlogDetails";
import { notFound } from "next/navigation";
import { TBlog } from "@/types/blog-types";
import { getBlog, getBlogMeta } from "@/actions/cached-data";

export async function generateStaticParams() {
  const slugs = await GetAllBlogSlugs();

  return slugs.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: RouteParams<"slug">) {
  const { slug } = await params;
  const blog = await getBlogMeta(slug);

  if (!blog) {
    notFound();
  }

  return {
    title: blog.title,
    description: blog.descriptions?.slice(0, 160),

    openGraph: {
      title: blog.title,
      description: blog.descriptions,
      url: `/read/${blog.slug}`,
      type: "article",
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    alternates: {
      canonical: `/read/${blog.slug}`,
    },
  };
}

const BlogReadPage = async ({ params }: RouteParams<"slug">) => {
  const { slug } = await params;
  const queryClient = new QueryClient();

  const blog: TBlog = await queryClient.fetchQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlog(slug),
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
