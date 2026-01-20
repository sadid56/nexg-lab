import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    await prisma.feedback.create({
      data: {
        emoji: data.emoji,
        feedback: data.feedback,
        anonymous: data.anonymous,
        postId: data.postId,
        userId: session?.user?.id || undefined,
      },
    });
    return NextResponse.json({ message: "feedback submited", status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.feedback.findMany({
        where: {
          OR: [
            { feedback: { contains: search, mode: "insensitive" } },
            { post: { title: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        include: {
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.feedback.count({
        where: {
          OR: [
            { feedback: { contains: search, mode: "insensitive" } },
            { post: { title: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
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
    console.error("Feedback fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 });
    }

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Feedback deleted successfully" });
  } catch (error: any) {
    console.error("Feedback delete error:", error);
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
  }
}
