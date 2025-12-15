import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/next";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { root, sections } = body;

    // Validate required fields
    if (!root?.title || !root?.slug || !root?.descriptions || !root?.category) {
      return NextResponse.json({ error: "Missing required fields: title, slug, descriptions, category" }, { status: 400 });
    }

    let coverImageUrl = "";
    if (root.coverImage && root.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(root.coverImage[0], {
        folder: "blogs/thumbnails",
        publicId: generateSlug(root.title),
      });
    }

    // Create post with nested sections and blocks
    const result = await prisma.post.create({
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
      include: {
        sections: {
          include: {
            blocks: true,
          },
        },
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
