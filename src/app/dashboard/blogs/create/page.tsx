"use client";

import { useCreateBlog } from "@/queries/actions/blogActions";
import BlogForm from "../_components/BlogForm";
import { toast } from "sonner";

export default function CreateBlogPage() {
  const createBlog = useCreateBlog();

  return (
    <BlogForm
      submitText='Create Blog'
      onSubmit={async (payload) => {
        await createBlog.mutateAsync(payload);
        toast.success("Blog created successfully");
      }}
    />
  );
}
