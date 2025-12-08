import Navbar from "@/components/layouts/navbar";
import React, { ReactNode } from "react";

const BlogsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default BlogsLayout;
