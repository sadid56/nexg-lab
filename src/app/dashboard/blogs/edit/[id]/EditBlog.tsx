"use client";

import { useGetBlogById, useUpdateBlog } from "@/react-query/blogs/actions";
import BlogForm from "../../_components/BlogForm";

export default function EditBlog({ id }: { id: string }) {
  const { data: blog, isLoading } = useGetBlogById(id!);
  const updateBlog = useUpdateBlog(id!);

  if (!id) return <div className='mt-20 text-center'>Invalid blog id</div>;
  if (isLoading) return <div className='mt-20 text-center'>Loading...</div>;

  return (
    <BlogForm
      submitText='Update Blog'
      initialData={blog}
      onSubmit={async (payload) => {
        await updateBlog.mutateAsync(payload);
      }}
    />
  );
}
