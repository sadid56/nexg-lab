/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const slug = generateSlug(body?.title);

    const category = await prisma.category.create({
      data: {
        title: body.title,
        slug: slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category title or slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
