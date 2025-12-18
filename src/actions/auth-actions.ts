"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const CheckUser = async (email: string) => {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // User exists
  return { success: true, user };
};

export const GetCurrentUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      throw new Error("User Not login!");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        email: true,
        image: true,
        name: true,
      },
    });
    return user;
  } catch {
    console.log("Failed to fetch current user");
    return null;
  }
};
