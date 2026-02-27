import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogPost } from "@/lib/blogs";

export interface RelatedArticlesProps {
  posts: BlogPost[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="pt-12 border-t border-border-warm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-serif text-ink">Related Articles / 関連記事</h3>
        <span className="font-serif text-xs text-primary/50 font-semibold">同カテゴリ</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.frontmatter.slug} hoverEffect className="bg-surface p-5">
            <CardHeader className="mb-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">
                  {post.frontmatter.category}
                </Badge>
                <span className="text-xs font-mono text-ink-muted">{post.readingTime}</span>
              </div>
              <CardTitle className="text-lg font-bold font-serif text-ink mt-2">
                {post.frontmatter.title}
              </CardTitle>
            </CardHeader>
            <CardFooter className="pt-3 border-t border-border-subtle">
              <Link
                href={`/blogs/${post.frontmatter.category.toLowerCase()}/${post.frontmatter.slug}`}
                className="w-full"
              >
                <Button variant="ghost" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                  Read Article
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
