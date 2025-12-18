import { GetBlogs } from "@/actions/blog-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import BlogCard from "./_components/BlogCard";
import { TBlog } from "@/types/blog-types";
import { Metadata } from "next";
import { NoData } from "@/components/ui/no-data";

export const metadata: Metadata = {
  title: {
    default: "NexG Lab — Modern software architecture",
    template: "%s | NexG Lab Blog",
  },

  description:
    "NexG Lab Blog shares practical tutorials, deep dives, and real-world insights on web development, Linux, and modern software architecture.",

  keywords: [
    "web development blog",
    "javascript tutorials",
    "react blog",
    "next.js blog",
    "frontend development",
    "backend engineering",
    "full stack development",
    "programming tutorials",
    "software engineering",
    "developer blog",
    "linux",
  ],

  authors: [{ name: "NexG Lab" }],
  creator: "NexG Lab",
  publisher: "NexG Lab",

  metadataBase: new URL(process.env.BETTER_AUTH_URL!),

  openGraph: {
    title: "NexG Lab Blog — Web Development & Engineering",
    description: "Practical tutorials and engineering insights on React, Next.js, JavaScript, backend systems, and modern web development.",
    url: process.env.BETTER_AUTH_URL,
    siteName: "NexG Lab",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NexG Lab Blog — Web Development & Engineering",
    description: "Tutorials, guides, and real-world lessons on React, Next.js, JavaScript, and full-stack development.",
  },

  alternates: {
    canonical: process.env.BETTER_AUTH_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient();
  const { category, search } = (await searchParams) as {
    category: string;
    search: string;
  };

  const blogs: TBlog[] = await queryClient.fetchQuery({
    queryKey: ["blogs"],
    queryFn: () => GetBlogs(category, search),
    staleTime: Infinity,
  });

  if (blogs?.length === 0) {
    return (
      <NoData
        title="Can't find any blog!"
        description="We can't find any blogs with our queries please try another search or filter."
      ></NoData>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {blogs?.map((blog: TBlog) => (
        <BlogCard post={blog} key={blog?.id} />
      ))}
    </HydrationBoundary>
  );
}
