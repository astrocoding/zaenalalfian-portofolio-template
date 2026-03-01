import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

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
  if (!fs.existsSync(docsDirectory)) return [];

  const categories = fs.readdirSync(docsDirectory);
  const docs: DocPost[] = [];

  for (const category of categories) {
    const categoryPath = path.join(docsDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".mdx")) {
          const filePath = path.join(categoryPath, file);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContent);

          const processedContent = await remark().use(html).process(content);

          docs.push({
            frontmatter: data as DocFrontmatter,
            content,
            htmlContent: processedContent.toString(),
            toc: extractToc(content),
          });
        }
      }
    }
  }

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
  const processedContent = await remark().use(html).process(content);

  return {
    frontmatter: data as DocFrontmatter,
    content,
    htmlContent: processedContent.toString(),
    toc: extractToc(content),
  };
}
