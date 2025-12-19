"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const PostNewsLetter = async (email: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    await prisma.newsletter.create({
      data: {
        userId: session?.user?.id || null,
        email,
      },
    });

    return { status: 201 };
  } catch (err) {
    console.error(err);
    return { status: 500, message: err };
  }
};
