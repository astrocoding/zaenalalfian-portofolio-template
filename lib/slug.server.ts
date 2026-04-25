/**
 * Server-only slug utilities.
 * Uses Prisma — NEVER import this file from Client Components.
 */

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function generateUniqueSlug(
  model: "project" | "blog" | "doc",
  title: string,
  rawSlug?: string,
  currentId?: string
): Promise<string> {
  const sourceText = rawSlug && rawSlug.trim().length > 0 ? rawSlug : title;
  const baseSlug = slugify(sourceText) || "untitled";

  let exists = false;

  if (model === "project") {
    const found = await prisma.project.findFirst({
      where: {
        slug: baseSlug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    });
    exists = !!found;
  } else if (model === "blog") {
    const found = await prisma.blog.findFirst({
      where: {
        slug: baseSlug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    });
    exists = !!found;
  } else if (model === "doc") {
    const found = await prisma.doc.findFirst({
      where: {
        slug: baseSlug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    });
    exists = !!found;
  }

  if (!exists) {
    return baseSlug;
  }

  // If slug already exists, append unique timestamp suffix
  const timestampSuffix = Date.now().toString().slice(-8);
  return `${baseSlug}-${timestampSuffix}`;
}
