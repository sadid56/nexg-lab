import React, { Suspense } from "react";
import EditBlog from "./EditBlog";
import { RouteParams } from "@/types/next";

const EditBlogPage = async ({ params }: RouteParams<"id">) => {
  const { id } = await params;
  return (
    <Suspense>
      <EditBlog id={id} />
    </Suspense>
  );
};

export default EditBlogPage;
