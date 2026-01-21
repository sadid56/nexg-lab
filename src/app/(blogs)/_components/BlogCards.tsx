"use client";

import { NoData } from "@/components/ui/no-data";
import { GetBlogs } from "@/actions/blog-actions";
import { useQuery } from "@tanstack/react-query";
import { CACHE_TIME } from "@/constants/common";
import BlogCardHorizontal from "./BlogCard";
import { BlogCardHorizontalSkeleton } from "./BlogCardHorizentalSkeketon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useDynamicLimit } from "@/hooks/useDynamicLimit";

const BlogCards = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const limit = useDynamicLimit(3);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ["blogs", category, search, page, limit],
    queryFn: () => GetBlogs(category, search, page, limit),
    staleTime: CACHE_TIME[10],
  });

  const blogs = data?.blogs || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: limit }).map((_, i) => (
          <BlogCardHorizontalSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <NoData
        title="Can't find any blog!"
        description="We can't find any blogs with our queries please try another search or filter."
      ></NoData>
    );
  }

  return (
    <div className='space-y-6 pb-10'>
      <div className='space-y-4'>
        {blogs.map((blog: any) => (
          <BlogCardHorizontal post={blog} key={blog.id}></BlogCardHorizontal>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 pt-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className='rounded-xl border-theme-primary/10 hover:bg-theme-primary/10 hover:text-theme-primary transition-all duration-300'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              const isActive = pageNumber === page;
              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "default" : "outline"}
                  size='sm'
                  onClick={() => handlePageChange(pageNumber)}
                  className={cn(
                    "min-w-9 h-9 rounded-xl font-bold transition-all duration-300",
                    isActive
                      ? "bg-theme-primary hover:bg-theme-primary/90 text-white shadow-lg shadow-theme-primary/20"
                      : "border-theme-primary/10 hover:bg-theme-primary/10 hover:text-theme-primary",
                  )}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className='rounded-xl border-theme-primary/10 hover:bg-theme-primary/10 hover:text-theme-primary transition-all duration-300'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogCards;
