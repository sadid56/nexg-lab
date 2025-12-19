"use client";

import { useCreateBlog } from "@/queries/actions/blogActions";
import BlogForm from "../_components/BlogForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const createBlog = useCreateBlog();
  const router = useRouter();

  return (
    <BlogForm
      submitText='Create Blog'
      onSubmit={async (payload) => {
        await createBlog.mutateAsync(payload);
        toast.success("Blog created successfully");
        router.push("/dashboard/blogs");
      }}
    />
  );
}
