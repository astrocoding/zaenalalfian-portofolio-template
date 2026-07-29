import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { getAllDocs } from "@/lib/docs";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zaenalalfian.dev";

  // Base static routes
  const staticPaths = ["", "/projects", "/blogs", "/docs", "/about", "/experiences", "/education"];
  const routes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Projects dynamic routes
  try {
    const projects = await prisma.project.findMany({ select: { slug: true, updatedAt: true } });
    projects.forEach((proj) => {
      routes.push({
        url: `${baseUrl}/projects/${proj.slug}`,
        lastModified: proj.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });
  } catch {
    // Database query fallback
  }

  // Blog dynamic routes
  try {
    const blogPosts = await getAllBlogPosts();
    blogPosts.forEach((post) => {
      routes.push({
        url: `${baseUrl}/blogs/${post.frontmatter.category.toLowerCase()}/${post.frontmatter.slug}`,
        lastModified: new Date(post.frontmatter.publishedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });
  } catch {
    // Ignore error
  }

  // Docs dynamic routes
  try {
    const docs = await getAllDocs();
    docs.forEach((doc) => {
      routes.push({
        url: `${baseUrl}/docs/${doc.frontmatter.category.toLowerCase()}/${doc.frontmatter.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  } catch {
    // Ignore error
  }

  return routes;
}
