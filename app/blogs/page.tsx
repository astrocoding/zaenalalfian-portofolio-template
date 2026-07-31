import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { ActionFooter } from "@/components/ui/ActionFooter";
import { BlogsPageLayout } from "@/components/blog/BlogsPageLayout";
import { getAllBlogPosts } from "@/lib/blogs";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Articles & Technical Insights | Zaenal Alfian",
  description:
    "A collection of engineering articles on Next.js, Prisma, software architecture, and Japanese minimalist UI design.",
  keywords: ["Tech Blog", "Software Engineering Articles", "Next.js", "TypeScript", "Zaenal Alfian"],
  alternates: {
    canonical: buildCanonical("/blogs"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/blogs"),
    title: "Articles & Technical Insights | Zaenal Alfian",
    description: "Engineering articles on Next.js, Prisma, software architecture, and Japanese minimalist UI design.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian Blog" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles & Technical Insights | Zaenal Alfian",
    description: "Engineering articles on Next.js, Prisma, and software architecture.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  const formattedBlogs = posts.map((post) => ({
    id: post.frontmatter.slug,
    title: post.frontmatter.title,
    slug: post.frontmatter.slug,
    category: post.frontmatter.category,
    description: post.frontmatter.description,
    publishedAt: post.frontmatter.publishedAt,
    readingTime: post.readingTime,
    thumbnail: post.frontmatter.thumbnail,
  }));

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper min-h-screen">
        <Container size="wide" className="space-y-12">
          <BlogsPageLayout blogs={formattedBlogs} />
          <ActionFooter
            title="Looking for Proven Full-Stack Engineering Expertise?"
            description="Discover featured client projects, enterprise web applications, open-source tools, and system benchmarks."
            secondaryButtonText="My Projects"
            secondaryButtonHref="/projects"
            primaryButtonText="Let's Connect!"
            primaryButtonHref="/#contact"
          />
        </Container>
      </div>
    </MainLayout>
  );
}
