"use client";

import { NoData } from "@/components/ui/no-data";
import { GetBlogs } from "@/actions/blog-actions";
import { useQuery } from "@tanstack/react-query";
import { CACHE_TIME } from "@/constants/common";
import BlogCardHorizontal from "./BlogCard";
import { Post } from "../../../../prisma/generated/client";
import { BlogCardHorizontalSkeleton } from "./BlogCardHorizentalSkeketon";

type BlogsResponse = Awaited<ReturnType<typeof GetBlogs>>;

const BlogCards = ({ category, search }: { category: string; search: string }) => {
  const { data: blogs, isLoading } = useQuery<BlogsResponse>({
    queryKey: ["blogs", category, search],
    queryFn: () => GetBlogs(category, search),
    staleTime: CACHE_TIME[10],
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 2 }).map((_, i) => (
          <BlogCardHorizontalSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (blogs?.length === 0) {
    return (
      <NoData
        title="Can't find any blog!"
        description="We can't find any blogs with our queries please try another search or filter."
      ></NoData>
    );
  }

  return (
    <div className='space-y-4'>
      {blogs?.map((blog: Post) => (
        <BlogCardHorizontal post={blog} key={blog.id}></BlogCardHorizontal>
      ))}
    </div>
  );
};

export default BlogCards;
