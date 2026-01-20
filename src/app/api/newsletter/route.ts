import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.newsletter.findMany({
        where: {
          OR: [{ email: { contains: search, mode: "insensitive" } }, { user: { name: { contains: search, mode: "insensitive" } } }],
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsletter.count({
        where: {
          OR: [{ email: { contains: search, mode: "insensitive" } }, { user: { name: { contains: search, mode: "insensitive" } } }],
        },
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Newsletter fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch newsletter subscribers" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Newsletter ID is required" }, { status: 400 });
    }

    await prisma.newsletter.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Subscriber removed successfully" });
  } catch (error: any) {
    console.error("Newsletter delete error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
