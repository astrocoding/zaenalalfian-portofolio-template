import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { getAllDocs } from "@/lib/docs";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // Static routes with priority per specification
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const routes: MetadataRoute.Sitemap = [...staticRoutes];

  // Projects dynamic routes — priority 0.9, updatedAt from DB
  try {
    const projects = await prisma.project.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    projects.forEach((proj) => {
      routes.push({
        url: `${baseUrl}/projects/${proj.slug}`,
        lastModified: proj.updatedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  } catch {
    // DB unavailable at build time — skip dynamic project routes
  }

  // Blog dynamic routes — priority 0.9 (published posts from filesystem)
  try {
    const blogPosts = await getAllBlogPosts();
    blogPosts.forEach((post) => {
      routes.push({
        url: `${baseUrl}/blogs/${post.frontmatter.category.toLowerCase()}/${post.frontmatter.slug}`,
        lastModified: new Date(post.frontmatter.publishedAt),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  } catch {
    // Content directory unavailable — skip
  }

  // Docs dynamic routes — priority 0.8
  try {
    const docs = await getAllDocs();
    docs.forEach((doc) => {
      routes.push({
        url: `${baseUrl}/docs/${doc.frontmatter.category.toLowerCase()}/${doc.frontmatter.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });
  } catch {
    // Content directory unavailable — skip
  }

  return routes;
}
