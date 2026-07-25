import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { LatestBlogsSection } from "@/components/sections";
import { getAllBlogPosts } from "@/lib/blogs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Articles & Technical Insights | Zaenal Alfian",
  description:
    "A collection of engineering articles on Next.js 16, Prisma 7, software architecture, and Japanese minimalist UI design.",
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
        <Container size="wide">
          <LatestBlogsSection blogs={formattedBlogs} />
        </Container>
      </div>
    </MainLayout>
  );
}
