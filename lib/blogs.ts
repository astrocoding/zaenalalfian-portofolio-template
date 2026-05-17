import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { prisma } from "@/lib/prisma";

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
  const postsMap = new Map<string, BlogPost>();

  // 1. Load from filesystem markdown files
  if (fs.existsSync(blogsDirectory)) {
    const categories = fs.readdirSync(blogsDirectory);
    for (const category of categories) {
      const categoryPath = path.join(blogsDirectory, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const files = fs.readdirSync(categoryPath);
        for (const file of files) {
          if (file.endsWith(".md") || file.endsWith(".mdx")) {
            const filePath = path.join(categoryPath, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const { data, content } = matter(fileContent);

            const processedContent = await remark().use(html, { sanitize: false }).process(content);
            const htmlContent = processedContent.toString();
            const frontmatter = data as BlogFrontmatter;

            postsMap.set(frontmatter.slug, {
              frontmatter,
              content,
              htmlContent,
              readingTime: calculateReadingTime(content),
            });
          }
        }
      }
    }
  }

  // 2. Fetch from Database (Prisma DB records take priority / add dynamically created/updated posts)
  try {
    const dbBlogs = await prisma.blog.findMany({
      orderBy: { publishedAt: "desc" },
    });

    for (const blog of dbBlogs) {
      const processedContent = await remark().use(html, { sanitize: false }).process(blog.content);
      postsMap.set(blog.slug, {
        frontmatter: {
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          description: blog.description,
          keywords: blog.keywords,
          thumbnail: blog.thumbnail || undefined,
          publishedAt: blog.publishedAt
            ? new Date(blog.publishedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
        content: blog.content,
        htmlContent: processedContent.toString(),
        readingTime: calculateReadingTime(blog.content),
      });
    }
  } catch {
    // Database query failed fallback
  }

  const posts = Array.from(postsMap.values());
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
  // 1. Try fetching from Database first
  try {
    const dbBlog = await prisma.blog.findUnique({
      where: { slug: slug },
    });

    if (dbBlog) {
      const processedContent = await remark().use(html, { sanitize: false }).process(dbBlog.content);
      return {
        frontmatter: {
          title: dbBlog.title,
          slug: dbBlog.slug,
          category: dbBlog.category,
          description: dbBlog.description,
          keywords: dbBlog.keywords,
          thumbnail: dbBlog.thumbnail || undefined,
          publishedAt: dbBlog.publishedAt
            ? new Date(dbBlog.publishedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
        content: dbBlog.content,
        htmlContent: processedContent.toString(),
        readingTime: calculateReadingTime(dbBlog.content),
      };
    }
  } catch {
    // Database query fallback
  }

  // 2. Fallback to local markdown files
  const filePath = path.join(
    blogsDirectory,
    category.toLowerCase(),
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    const mdxPath = path.join(
      blogsDirectory,
      category.toLowerCase(),
      `${slug}.mdx`
    );
    if (!fs.existsSync(mdxPath)) return null;
    const fileContent = fs.readFileSync(mdxPath, "utf8");
    const { data, content } = matter(fileContent);
    const processedContent = await remark().use(html, { sanitize: false }).process(content);
    return {
      frontmatter: data as BlogFrontmatter,
      content,
      htmlContent: processedContent.toString(),
      readingTime: calculateReadingTime(content),
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html, { sanitize: false }).process(content);

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
