import { ReactNode } from "react";
import BlogsLayoutClient from "../../components/layouts/BlogsLayoutClient";

const BlogsLayout = ({ children }: { children: ReactNode }) => {
  return <BlogsLayoutClient>{children}</BlogsLayoutClient>;
};

export default BlogsLayout;
