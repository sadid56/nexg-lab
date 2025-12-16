import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parseDevice } from "@/lib/parseDevice";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { sessions: true },
      where: search
        ? {
            OR: [{ email: { contains: search, mode: "insensitive" } }, { name: { contains: search, mode: "insensitive" } }],
          }
        : undefined,
    });

    // Map users and parse device info for each session
    const usersWithDevice = users.map((user) => ({
      ...user,
      sessions: user.sessions.map((session) => ({
        ip: session?.ipAddress,
        userAgent: session?.userAgent,
        deviceInfo: parseDevice(session.userAgent),
      })),
    }));

    return NextResponse.json(usersWithDevice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users data" }, { status: 500 });
  }
}
