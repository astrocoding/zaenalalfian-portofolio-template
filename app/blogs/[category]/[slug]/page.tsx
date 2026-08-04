import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import {
  BlogHeader,
  MarkdownRenderer,
  RelatedArticles,
  BlogSidebar,
} from "@/components/blog";
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from "@/lib/blogs";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

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

  const canonicalUrl = buildCanonical(
    `/blogs/${resolvedParams.category}/${resolvedParams.slug}`
  );
  const ogImage = post.frontmatter.thumbnail || DEFAULT_OG_IMAGE();

  return {
    title: `${post.frontmatter.title} — Technical Blog | Zaenal Alfian`,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords || [post.frontmatter.category, "Software Architecture"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.frontmatter.publishedAt,
      authors: ["Zaenal Alfian"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
      siteName: "Zaenal Alfian Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImage],
      creator: "@zaenalalfian",
    },
  };
}

import { recordPageView } from "@/lib/viewCounter";

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

  // Record organic page view for this blog post
  await recordPageView("blog", resolvedParams.slug, resolvedParams.category);

  const relatedPosts = await getRelatedPosts(
    resolvedParams.category,
    resolvedParams.slug
  );

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default">
          {/* Header */}
          <BlogHeader
            title={post.frontmatter.title}
            category={post.frontmatter.category}
            publishedAt={post.frontmatter.publishedAt}
            readingTime={post.readingTime}
            description={post.frontmatter.description}
            thumbnail={post.frontmatter.thumbnail}
          />

          {/* Main Content & Right Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
            {/* Main Article Body (8 cols on desktop) */}
            <main className="lg:col-span-8 min-w-0">
              <MarkdownRenderer contentHtml={post.htmlContent} />
            </main>

            {/* Right Sidebar Aside (4 cols on desktop, sticky top) */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
              <BlogSidebar
                title={post.frontmatter.title}
                keywords={
                  post.frontmatter.keywords || [
                    post.frontmatter.category,
                    "Software Architecture",
                  ]
                }
                slug={post.frontmatter.slug}
                category={post.frontmatter.category}
              />
            </aside>
          </div>

          {/* Related Articles Footer */}
          <div className="pt-16 border-t border-border-warm mt-16">
            <RelatedArticles posts={relatedPosts} />
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
