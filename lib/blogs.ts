import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface BlogFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  keywords?: string[];
  thumbnail?: string;
  publishedAt: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
  htmlContent: string;
  readingTime: string;
}

const blogsDirectory = path.join(process.cwd(), "content/blogs");

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  const categories = fs.readdirSync(blogsDirectory);
  const posts: BlogPost[] = [];

  for (const category of categories) {
    const categoryPath = path.join(blogsDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".mdx")) {
          const filePath = path.join(categoryPath, file);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContent);

          const processedContent = await remark().use(html).process(content);
          const htmlContent = processedContent.toString();

          posts.push({
            frontmatter: data as BlogFrontmatter,
            content,
            htmlContent,
            readingTime: calculateReadingTime(content),
          });
        }
      }
    }
  }

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export async function getBlogPost(
  category: string,
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(
    blogsDirectory,
    category.toLowerCase(),
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    // Try .mdx extension fallback
    const mdxPath = path.join(
      blogsDirectory,
      category.toLowerCase(),
      `${slug}.mdx`
    );
    if (!fs.existsSync(mdxPath)) return null;
    const fileContent = fs.readFileSync(mdxPath, "utf8");
    const { data, content } = matter(fileContent);
    const processedContent = await remark().use(html).process(content);
    return {
      frontmatter: data as BlogFrontmatter,
      content,
      htmlContent: processedContent.toString(),
      readingTime: calculateReadingTime(content),
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);

  return {
    frontmatter: data as BlogFrontmatter,
    content,
    htmlContent: processedContent.toString(),
    readingTime: calculateReadingTime(content),
  };
}

export async function getRelatedPosts(
  category: string,
  currentSlug: string
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(
    (post) =>
      post.frontmatter.category.toLowerCase() === category.toLowerCase() &&
      post.frontmatter.slug !== currentSlug
  );
}
