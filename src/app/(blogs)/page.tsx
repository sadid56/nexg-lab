import { GetBlogs } from "@/actions/blog-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import BlogCard from "./_components/BlogCard";
import { TBlog } from "@/types/blog-types";
import { Metadata } from "next";

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
