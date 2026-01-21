"use server";

import prisma from "@/lib/prisma";

export const GetBlogs = async (category?: string, search?: string, page: number = 1, limit: number = 3) => {
  const skip = (page - 1) * limit;

  try {
    const whereClause: any = {
      status: "active",
      ...(category && {
        category: {
          equals: category,
          mode: "insensitive" as const,
        },
      }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [blogs, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: whereClause,
      }),
    ]);

    return { blogs, totalCount };
  } catch (error) {
    console.error("GetBlogs error:", error);
    return { blogs: [], totalCount: 0 };
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

export const GetRecentBlog = async () => {
  try {
    const result = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      where: {
        status: "active",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        readTime: true,
      },
    });
    return result;
  } catch {
    console.log("Failed to get recent blog");
  }
};

export const GetHomeCategory = async () => {
  try {
    const result = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  } catch {
    console.log("Failed to get recent blog");
  }
};
