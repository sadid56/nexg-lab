"use client";

import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./MarkdownComponents";
import { TBlog } from "@/types/blog-types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BlogDetails = ({ blog }: { blog: TBlog }) => {
  const router = useRouter();
  return (
    <div className=''>
      {/* Blog header */}
      <div className='flex items-center gap-2 mb-4'>
        <Button onClick={() => router.back()} variant={"outline"} className='cursor-pointer'>
          <ArrowLeft />
        </Button>{" "}
        <h1 className='text-3xl font-bold'>{blog.title}</h1>
      </div>
      <p className='text-sm text-gray-500 mb-4'>
        Category: {blog.category} | Last updated at: {format(new Date(blog?.updatedAt), "dd MMM, yyyy")}
      </p>
      {/* Cover image */}
      {blog.coverImage && <Image width={800} height={800} src={blog.coverImage} alt={blog.title} className='w-full h-auto rounded mb-6' />}
      {/* Tags */}
      <div className='flex gap-2 mb-6'>
        {blog.tags.map((tag: string) => (
          <span key={tag} className='bg-orange-100 text-orange-700 px-2 py-1 rounded'>
            {tag}
          </span>
        ))}
      </div>
      {/* Description */}
      <p className='mb-6'>{blog.descriptions}</p>
      <div className='mb-6'>
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {blog?.content}
        </Markdown>
      </div>
    </div>
  );
};

export default BlogDetails;
