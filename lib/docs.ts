import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { prisma } from "@/lib/prisma";

export interface DocTocItem {
  id: string;
  text: string;
  level: number;
}

export interface DocFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  order?: number;
}

export interface DocPost {
  frontmatter: DocFrontmatter;
  content: string;
  htmlContent: string;
  toc: DocTocItem[];
}

export interface CategoryGroup {
  category: string;
  displayName: string;
  docs: { title: string; slug: string }[];
}

const docsDirectory = path.join(process.cwd(), "content/docs");

export function extractToc(content: string): DocTocItem[] {
  const headingLines = content.split("\n").filter((line) => line.startsWith("##"));
  return headingLines.map((line) => {
    const level = line.startsWith("###") ? 3 : 2;
    const text = line.replace(/^###?\s+/, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return { id, text, level };
  });
}

export async function getAllDocs(): Promise<DocPost[]> {
  const docsMap = new Map<string, DocPost>();

  // 1. Fetch from local filesystem markdown files
  if (fs.existsSync(docsDirectory)) {
    const categories = fs.readdirSync(docsDirectory);
    for (const category of categories) {
      const categoryPath = path.join(docsDirectory, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const files = fs.readdirSync(categoryPath);
        for (const file of files) {
          if (file.endsWith(".md") || file.endsWith(".mdx")) {
            const filePath = path.join(categoryPath, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const { data, content } = matter(fileContent);

            const processedContent = await remark()
              .use(html, { sanitize: false, allowDangerousHtml: true })
              .process(content);
            const frontmatter = data as DocFrontmatter;

            docsMap.set(frontmatter.slug, {
              frontmatter,
              content,
              htmlContent: processedContent.toString(),
              toc: extractToc(content),
            });
          }
        }
      }
    }
  }

  // 2. Fetch from Database (Prisma DB records add/override dynamic documentation)
  try {
    const dbDocs = await prisma.doc.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
    });

    for (const doc of dbDocs) {
      const processedContent = await remark()
        .use(html, { sanitize: false, allowDangerousHtml: true })
        .process(doc.content);
      docsMap.set(doc.slug, {
        frontmatter: {
          title: doc.title,
          slug: doc.slug,
          category: doc.category,
          description: doc.description,
          order: doc.order,
        },
        content: doc.content,
        htmlContent: processedContent.toString(),
        toc: extractToc(doc.content),
      });
    }
  } catch (err) {
    console.error("Error fetching dbDocs in getAllDocs:", err);
  }

  const docs = Array.from(docsMap.values());
  return docs.sort(
    (a, b) => (a.frontmatter.order || 99) - (b.frontmatter.order || 99)
  );
}

export async function getDocGroupedByCategory(): Promise<CategoryGroup[]> {
  const allDocs = await getAllDocs();
  const groupsMap: Record<string, { title: string; slug: string }[]> = {};

  allDocs.forEach((doc) => {
    const cat = doc.frontmatter.category.toLowerCase();
    if (!groupsMap[cat]) groupsMap[cat] = [];
    groupsMap[cat].push({
      title: doc.frontmatter.title,
      slug: doc.frontmatter.slug,
    });
  });

  return Object.keys(groupsMap).map((cat) => ({
    category: cat,
    displayName: cat.replace("-", " ").toUpperCase(),
    docs: groupsMap[cat],
  }));
}

export async function getDocPost(
  category: string,
  slug: string
): Promise<DocPost | null> {
  // 1. Try fetching from Database first
  try {
    const dbDoc = await prisma.doc.findFirst({
      where: { slug: slug, status: "published" },
    });

    if (dbDoc) {
      const processedContent = await remark()
        .use(html, { sanitize: false, allowDangerousHtml: true })
        .process(dbDoc.content);
      return {
        frontmatter: {
          title: dbDoc.title,
          slug: dbDoc.slug,
          category: dbDoc.category,
          description: dbDoc.description,
          order: dbDoc.order,
        },
        content: dbDoc.content,
        htmlContent: processedContent.toString(),
        toc: extractToc(dbDoc.content),
      };
    }
  } catch {
    // Database query fallback
  }

  // 2. Fallback to local markdown files
  const filePath = path.join(
    docsDirectory,
    category.toLowerCase(),
    `${slug}.md`
  );

  let fileContent = "";
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf8");
  } else {
    const mdxPath = path.join(
      docsDirectory,
      category.toLowerCase(),
      `${slug}.mdx`
    );
    if (!fs.existsSync(mdxPath)) return null;
    fileContent = fs.readFileSync(mdxPath, "utf8");
  }

  const { data, content } = matter(fileContent);
  const processedContent = await remark()
    .use(html, { sanitize: false, allowDangerousHtml: true })
    .process(content);

  return {
    frontmatter: data as DocFrontmatter,
    content,
    htmlContent: processedContent.toString(),
    toc: extractToc(content),
  };
}
