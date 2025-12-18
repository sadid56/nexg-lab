import { uploadToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data?.title || !data?.slug || !data?.descriptions || !data?.category) {
      return NextResponse.json({ error: "Missing required fields: title, slug, descriptions, category" }, { status: 400 });
    }

    let coverImageUrl = "";
    if (data.coverImage && data.coverImage) {
      coverImageUrl = await uploadToCloudinary(data.coverImage, {
        folder: "blogs/thumbnails",
        publicId: generateSlug(data.title),
      });
    }

    // Create post with nested sections and blocks
    const result = await prisma.post.create({
      data: {
        title: data.title,
        slug: generateSlug(data.slug),
        tags: data.tags || [],
        coverImage: coverImageUrl,
        descriptions: data.descriptions,
        category: data.category,
        readTime: data?.readTime,
        content: data?.content,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to create post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const blogs = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updatedBlog = await prisma.post.update({
      where: { id },
      data: {
        status: status as any,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update blog status" }, { status: 500 });
  }
}
