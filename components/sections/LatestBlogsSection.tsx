"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  publishedAt: string;
  readingTime?: string;
}

const fallbackBlogs: BlogItem[] = [
  {
    id: "blog-1",
    title: "Mastering Next.js 16 App Router & Prisma 7 Driver Adapters",
    slug: "nextjs-16-prisma-7-driver-adapters",
    category: "Architecture",
    description:
      "A deep dive into setting up Prisma 7 SQL driver adapters with PostgreSQL, server components, and clean data access patterns.",
    publishedAt: "2026-06-15",
    readingTime: "6 min read",
  },
  {
    id: "blog-2",
    title: "The Art of Japanese Minimalist UI: Designing for Clarity and Ma",
    slug: "japanese-minimalist-ui-design-clarity",
    category: "Design System",
    description:
      "How traditional Japanese spatial aesthetics (*Ma*) and muted rice paper color palettes improve user focus and reduce cognitive load.",
    publishedAt: "2026-05-28",
    readingTime: "8 min read",
  },
  {
    id: "blog-3",
    title: "Optimizing React 19 Server Components for Core Web Vitals",
    slug: "optimizing-react-19-server-components",
    category: "Performance",
    description:
      "Practical strategies to eliminate hydration shifts, optimize streaming boundaries, and achieve sub-200ms INP metrics.",
    publishedAt: "2026-04-10",
    readingTime: "5 min read",
  },
];

export const LatestBlogsSection: React.FC<{ blogs?: BlogItem[] }> = ({
  blogs = fallbackBlogs,
}) => {
  return (
    <SectionWrapper
      id="blogs"
      kanjiSubtitle="最新記事"
      sectionTitle="Latest Technical Insights"
      sectionDescription="Articles on modern frontend engineering, system design, performance, and editorial UI craftsmanship."
      bgVariant="surface"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Card key={blog.id} hoverEffect className="flex flex-col h-full bg-paper">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">
                  {blog.category}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-ink-muted font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{blog.readingTime || "5 min read"}</span>
                </div>
              </div>
              <CardTitle className="text-lg font-bold font-serif text-ink mt-3 leading-snug">
                {blog.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <CardDescription className="text-sm leading-relaxed text-ink-muted">
                {blog.description}
              </CardDescription>
            </CardContent>

            <CardFooter className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {blog.publishedAt}
              </span>
              <Link href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}>
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Read Article
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
