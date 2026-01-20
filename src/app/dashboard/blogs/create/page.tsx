"use client";

import BlogForm from "../_components/BlogForm";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/react-query/blogs/actions";

export default function CreateBlogPage() {
  const createBlog = useCreateBlog();
  const router = useRouter();

  return (
    <BlogForm
      submitText='Create Blog'
      onSubmit={async (payload) => {
        await createBlog.mutateAsync(payload);
        router.push("/dashboard/blogs");
      }}
    />
  );
}
