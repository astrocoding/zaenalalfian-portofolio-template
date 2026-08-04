import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getBlogPost } from "@/lib/blogs";
import { getDocPost } from "@/lib/docs";

export type ViewTargetType = "project" | "blog" | "doc";

/**
 * Privacy-preserving, organic view counter with IP + device fingerprint hardening.
 * Deduplicates multiple views from the same IP + User Agent + Locale combination.
 * Automatically syncs local markdown posts/docs to PostgreSQL if not yet in database.
 */
export async function recordPageView(
  targetType: ViewTargetType,
  targetIdOrSlug: string,
  category?: string
): Promise<void> {
  if (!targetIdOrSlug) return;

  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "unknown-agent";
    const acceptLanguage = headersList.get("accept-language") || "unknown-lang";

    // Generate SHA-256 fingerprint hash of (Client IP + User Agent + Accept Language)
    const rawFingerprint = `${clientIp}::${userAgent}::${acceptLanguage}`;
    const fingerprint = crypto
      .createHash("sha256")
      .update(rawFingerprint)
      .digest("hex");

    let resolvedId: string | null = null;

    // Resolve model ID based on targetType and ID or slug
    if (targetType === "project") {
      const proj = await prisma.project.findFirst({
        where: { OR: [{ id: targetIdOrSlug }, { slug: targetIdOrSlug }] },
        select: { id: true },
      });
      if (proj) resolvedId = proj.id;
    } else if (targetType === "blog") {
      let blog = await prisma.blog.findFirst({
        where: { OR: [{ id: targetIdOrSlug }, { slug: targetIdOrSlug }] },
        select: { id: true },
      });

      // If not in DB, check markdown file and auto-sync to DB
      if (!blog && category) {
        try {
          const post = await getBlogPost(category, targetIdOrSlug);
          if (post) {
            const dbBlog = await prisma.blog.upsert({
              where: { slug: post.frontmatter.slug },
              create: {
                title: post.frontmatter.title,
                slug: post.frontmatter.slug,
                category: post.frontmatter.category,
                description: post.frontmatter.description,
                content: post.content,
                status: "published",
                views: 0,
              },
              update: {},
              select: { id: true },
            });
            blog = dbBlog;
          }
        } catch (e) {
          console.warn("[PageViewCounter] Failed to sync blog from markdown:", e);
        }
      }

      if (blog) resolvedId = blog.id;
    } else if (targetType === "doc") {
      let doc = await prisma.doc.findFirst({
        where: { OR: [{ id: targetIdOrSlug }, { slug: targetIdOrSlug }] },
        select: { id: true },
      });

      // If not in DB, check markdown file and auto-sync to DB
      if (!doc && category) {
        try {
          const docPost = await getDocPost(category, targetIdOrSlug);
          if (docPost) {
            const dbDoc = await prisma.doc.upsert({
              where: { slug: docPost.frontmatter.slug },
              create: {
                title: docPost.frontmatter.title,
                slug: docPost.frontmatter.slug,
                category: docPost.frontmatter.category,
                description: docPost.frontmatter.description,
                content: docPost.content,
                status: "published",
                views: 0,
              },
              update: {},
              select: { id: true },
            });
            doc = dbDoc;
          }
        } catch (e) {
          console.warn("[PageViewCounter] Failed to sync doc from markdown:", e);
        }
      }

      if (doc) resolvedId = doc.id;
    }

    if (!resolvedId) return;

    // Perform atomic transaction: insert unique page view log & increment views counter if fingerprint is new
    await prisma.$transaction(async (tx) => {
      const existing = await tx.pageView.findUnique({
        where: {
          targetType_targetId_fingerprint: {
            targetType,
            targetId: resolvedId,
            fingerprint,
          },
        },
      });

      if (!existing) {
        await tx.pageView.create({
          data: {
            targetType,
            targetId: resolvedId,
            fingerprint,
          },
        });

        if (targetType === "project") {
          await tx.project.update({
            where: { id: resolvedId },
            data: { views: { increment: 1 } },
          });
        } else if (targetType === "blog") {
          await tx.blog.update({
            where: { id: resolvedId },
            data: { views: { increment: 1 } },
          });
        } else if (targetType === "doc") {
          await tx.doc.update({
            where: { id: resolvedId },
            data: { views: { increment: 1 } },
          });
        }
      }
    });
  } catch (error) {
    // Gracefully swallow errors during static pre-rendering or concurrent race conditions
    console.warn(
      `[PageViewCounter] Non-fatal error recording page view for ${targetType}:${targetIdOrSlug}:`,
      error
    );
  }
}
