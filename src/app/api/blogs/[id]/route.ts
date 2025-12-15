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
      include: {
        sections: {
          include: {
            blocks: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    /**
     * Shape response to match BlogEditor defaultValues
     */
    const response = {
      root: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        descriptions: blog.descriptions,
        category: blog.category,
        tags: blog.tags ?? [],
        status: blog.status,
        coverImage: blog.coverImage,
      },
      sections: blog.sections.map((section) => ({
        markdown: section.markdown,
        blocks: section.blocks.map((block) => ({
          type: block.type.toLowerCase(), // INFO -> info
          content: block.content,
        })),
      })),
    };

    return NextResponse.json(response, { status: 200 });
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
      include: {
        sections: true,
      },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const body = await request.json();
    const { root, sections } = body;
    const { id } = await params;

    // Validate required fields
    if (!root?.title || !root?.slug || !root?.descriptions || !root?.category) {
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
    if (root.coverImage) {
      const isOldImage = root.coverImage.startsWith("https");

      if (!isOldImage) {
        // Delete old image from Cloudinary if it exists
        if (existingBlog.coverImage) {
          try {
            await deleteFromCloudinary(root.coverImage);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
            // Continue even if delete fails
          }
        }

        // Upload new image
        coverImageUrl = await uploadToCloudinary(root.coverImage, {
          folder: "blogs/thumbnails",
          publicId: generateSlug(root.title),
        });
      }
      // If it's an existing URL, keep it as is
    }

    // Delete existing sections and blocks (cascade delete)
    await prisma.section.deleteMany({
      where: { postId: id },
    });

    // Update post with new sections and blocks
    const result = await prisma.post.update({
      where: { id: id },
      data: {
        title: root.title,
        slug: generateSlug(root.slug),
        tags: root.tags || [],
        coverImage: coverImageUrl,
        descriptions: root.descriptions,
        category: root.category,
        sections: {
          create:
            sections?.map((section: any) => ({
              markdown: section.markdown,
              ...(section.blocks &&
                section.blocks.length > 0 && {
                  blocks: {
                    create: section.blocks.map((block: any) => ({
                      type: block.type.toUpperCase() as any,
                      content: block.content,
                    })),
                  },
                }),
            })) || [],
        },
      },
      include: {
        sections: {
          include: {
            blocks: true,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to update post" }, { status: 500 });
  }
}
