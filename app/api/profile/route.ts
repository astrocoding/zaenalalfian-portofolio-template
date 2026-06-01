import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { username: true },
      orderBy: { createdAt: "asc" },
    });

    const username = user?.username || "astrocoding";
    return NextResponse.json({ username });
  } catch (error) {
    console.error("Error fetching profile username:", error);
    return NextResponse.json({ username: "astrocoding" });
  }
}
