"use server";

import prisma from "@/lib/prisma";

export const GetBlogs = async () => {
  try {
    const result = await prisma.post.findMany({
      where: {
        status: "active",
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export async function GetAllBlogSlugs(): Promise<{ slug: string }[]> {
  // Fetch only the slugs of published blogs
  const slugs = await prisma.post.findMany({
    select: { slug: true },
    where: { status: "active" },
  });

  return slugs;
}

export const GetBlogDetails = async (slug: string) => {
  try {
    const result = await prisma.post.findUnique({
      where: {
        slug,
        status: "active",
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const GetBlogDetailsMetaData = async (slug: string) => {
  try {
    const result = await prisma.post.findUnique({
      where: {
        slug,
        status: "active",
      },
      select: {
        title: true,
        coverImage: true,
        slug: true,
        descriptions: true,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};
