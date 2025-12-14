import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

// GET single category
export async function GET(request: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT update category
export async function PUT(request: NextRequest, { params }: PageProps) {
  try {
    const body = await request.json();
    const { id } = await params;
    const slug = body.slug || generateSlug(body?.title);

    const category = await prisma.category.update({
      where: { id: id },
      data: {
        title: body.title,
        slug: slug,
        status: body?.status,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category title or slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
