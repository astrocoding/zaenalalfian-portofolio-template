import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { BlogHeader, MarkdownRenderer, RelatedArticles } from "@/components/blog";
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from "@/lib/blogs";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    category: post.frontmatter.category.toLowerCase(),
    slug: post.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.category, resolvedParams.slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${post.frontmatter.title} — Technical Blog | Zaenal Alfian`,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords || [post.frontmatter.category, "Software Architecture"],
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.category, resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    resolvedParams.category,
    resolvedParams.slug
  );

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="narrow" className="space-y-8">
          {/* Header */}
          <BlogHeader
            title={post.frontmatter.title}
            category={post.frontmatter.category}
            publishedAt={post.frontmatter.publishedAt}
            readingTime={post.readingTime}
            description={post.frontmatter.description}
          />

          {/* Article Body */}
          <MarkdownRenderer contentHtml={post.htmlContent} />

          {/* Related Articles Footer */}
          <RelatedArticles posts={relatedPosts} />
        </Container>
      </div>
    </MainLayout>
  );
}
