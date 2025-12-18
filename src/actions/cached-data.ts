import { cache } from "react";
import { GetBlogDetails, GetBlogDetailsMetaData } from "./blog-actions";

export const getBlog = cache(async (slug: string) => {
  return GetBlogDetails(slug);
});

export const getBlogMeta = cache(async (slug: string) => {
  return GetBlogDetailsMetaData(slug);
});
