import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { DocHeader } from "@/components/docs/DocHeader";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { getDocPost, getAllDocs } from "@/lib/docs";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({
    category: doc.frontmatter.category.toLowerCase(),
    slug: doc.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = await getDocPost(resolvedParams.category, resolvedParams.slug);

  if (!doc) {
    return { title: "Document Not Found" };
  }

  const canonicalUrl = buildCanonical(
    `/docs/${resolvedParams.category}/${resolvedParams.slug}`
  );

  return {
    title: `${doc.frontmatter.title} — Documentation | Zaenal Alfian`,
    description: doc.frontmatter.description,
    keywords: [doc.frontmatter.category, "Documentation", "Technical Reference", "Zaenal Alfian"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      type: "article",
      url: canonicalUrl,
      images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: doc.frontmatter.title }],
      siteName: "Zaenal Alfian Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      images: [DEFAULT_OG_IMAGE()],
      creator: "@zaenalalfian",
    },
  };
}

import { recordPageView } from "@/lib/viewCounter";

export default async function DocumentationDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = await getDocPost(resolvedParams.category, resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  // Record organic page view for this documentation guide
  await recordPageView("doc", resolvedParams.slug, resolvedParams.category);

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper min-h-screen">
        <Container size="narrow">
          {/* Header */}
          <DocHeader
            title={doc.frontmatter.title}
            category={doc.frontmatter.category}
            description={doc.frontmatter.description}
          />

          {/* Document Content Body */}
          <MarkdownRenderer contentHtml={doc.htmlContent} />
        </Container>
      </div>
    </MainLayout>
  );
}
