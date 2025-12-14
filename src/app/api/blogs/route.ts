import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // Validate required fields
    if (!body.title || !body.slug || !body.descriptions || !body.category) {
      return NextResponse.json({ error: "Missing required fields: title, slug, descriptions, category" }, { status: 400 });
    }

    console.log("Creating post with data:", {
      title: body.title,
      slug: body.slug,
      category: body.category,
    });

    // Create post with nested section creation
    const result = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        tags: body.tags || [],
        coverImage: "",
        descriptions: body.descriptions,
        category: body.category,
        // Create sections with blocks
        sections: {
          create:
            body.sections?.map((section: any) => ({
              markdown: section.markdown,
              ...(section.blocks &&
                section.blocks.length > 0 && {
                  blocks: {
                    create: section.blocks.map((block: any) => ({
                      type: block.type.toUpperCase() as any, // Ensure enum format (INFO, WARNING, ERROR, TIPS)
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

    console.log("Post created successfully:", result.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
