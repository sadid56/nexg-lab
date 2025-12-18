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
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
