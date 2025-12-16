import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/next";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: RouteParams<"id">) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Keyword deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete keyword" }, { status: 500 });
  }
}
