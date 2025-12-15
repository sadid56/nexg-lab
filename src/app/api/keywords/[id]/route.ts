import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/next";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

// GET single keyword
export async function GET(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const { id } = await params;
    const keyword = await prisma.keywords.findUnique({
      where: { id },
    });

    if (!keyword) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    return NextResponse.json(keyword);
  } catch {
    return NextResponse.json({ error: "Failed to fetch keyword" }, { status: 500 });
  }
}

// PUT update keyword
export async function PUT(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const body = await request.json();
    const { id } = await params;
    const slug = body.slug || generateSlug(body?.title);

    const keyword = await prisma.keywords.update({
      where: { id },
      data: {
        title: body.title,
        slug: slug,
      },
    });

    return NextResponse.json(keyword);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Keyword title or slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update keyword" }, { status: 500 });
  }
}

// DELETE keyword
export async function DELETE(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const { id } = await params;
    await prisma.keywords.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Keyword deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete keyword" }, { status: 500 });
  }
}
