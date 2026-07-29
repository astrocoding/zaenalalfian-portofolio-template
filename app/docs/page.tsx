import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { DocsPageLayout } from "@/components/docs/DocsPageLayout";
import { getAllDocs } from "@/lib/docs";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Technical Documentation & Guides | Zaenal Alfian",
  description:
    "Comprehensive technical documentation, architecture blueprints, design system notes, and engineering guides.",
  keywords: ["Documentation", "Architecture Blueprints", "System Design", "Zaenal Alfian"],
  alternates: {
    canonical: buildCanonical("/docs"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/docs"),
    title: "Technical Documentation & Guides | Zaenal Alfian",
    description: "Technical documentation, architecture blueprints, and design system notes by Zaenal Alfian.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian Documentation" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Documentation & Guides | Zaenal Alfian",
    description: "Technical documentation and architecture blueprints by Zaenal Alfian.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function DocsPage() {
  const posts = await getAllDocs();

  const formattedDocs = posts.map((post) => ({
    title: post.frontmatter.title,
    slug: post.frontmatter.slug,
    category: post.frontmatter.category,
    description: post.frontmatter.description,
  }));

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper min-h-screen">
        <Container size="wide">
          <DocsPageLayout docs={formattedDocs} />
        </Container>
      </div>
    </MainLayout>
  );
}
