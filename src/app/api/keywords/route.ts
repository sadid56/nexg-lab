import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

// GET all keywords
export async function GET() {
  try {
    const keywords = await prisma.keywords.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch keywords" }, { status: 500 });
  }
}

// POST create new keyword
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = generateSlug(body?.title);

    const keyword = await prisma.keywords.create({
      data: {
        title: body.title,
        slug: slug,
      },
    });

    return NextResponse.json(keyword, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Keyword title or slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create keyword" }, { status: 500 });
  }
}
