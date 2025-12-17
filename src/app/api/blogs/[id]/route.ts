import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/next";
import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { generateSlug } from "@/utils/generateSlug";

export async function GET(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Blog id is required" }, { status: 400 });
    }

    const blog = await prisma.post.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("GET BLOG ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const { id } = await params;

    // Find the blog post first
    const post = await prisma.post.findUnique({
      where: { id },
      select: { coverImage: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the cover image from Cloudinary if it exists
    if (post.coverImage) await deleteFromCloudinary(post.coverImage);

    // Delete the blog post from DB
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const data = await request.json();
    const { id } = await params;

    // Validate required fields
    if (!data?.title || !data?.slug || !data?.descriptions || !data?.category) {
      return NextResponse.json({ error: "Missing required fields: title, slug, descriptions, category" }, { status: 400 });
    }

    // Fetch existing blog to get current cover image
    const existingBlog = await prisma.post.findUnique({
      where: { id: id },
      select: { coverImage: true },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    let coverImageUrl = existingBlog.coverImage;

    // Handle cover image update
    if (data.coverImage) {
      const isOldImage = data.coverImage.startsWith("https");

      if (!isOldImage) {
        // Delete old image from Cloudinary if it exists
        if (existingBlog.coverImage) {
          try {
            await deleteFromCloudinary(data.coverImage);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
            // Continue even if delete fails
          }
        }

        // Upload new image
        coverImageUrl = await uploadToCloudinary(data.coverImage, {
          folder: "blogs/thumbnails",
          publicId: generateSlug(data.title),
        });
      }
      // If it's an existing URL, keep it as is
    }

    // Update post with new sections and blocks
    const result = await prisma.post.update({
      where: { id: id },
      data: {
        title: data.title,
        slug: generateSlug(data.slug),
        tags: data.tags || [],
        coverImage: coverImageUrl,
        descriptions: data.descriptions,
        category: data.category,
        content: data?.content,
        readTime: data?.readTime,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to update post" }, { status: 500 });
  }
}
