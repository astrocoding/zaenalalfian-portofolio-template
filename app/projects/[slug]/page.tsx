import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { ProjectHeader, ProjectGallery, ProjectCaseStudy } from "@/components/project";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

// Sample fallback projects when database has not been seeded
const fallbackProjects = [
  {
    id: "proj-1",
    title: "Zenith Architecture Platform",
    slug: "zenith-architecture-platform",
    category: "Full-Stack Web App",
    description:
      "Enterprise Next.js 16 app with Server Components, PostgreSQL, and Prisma ORM for high-throughput cloud infrastructure management.",
    thumbnail: "/projects/zenith.jpg",
    techstack: ["Next.js 16", "React 19", "PostgreSQL", "Prisma 7", "TailwindCSS v4"],
    repository: "https://github.com/zaenalalfian/zenith-platform",
    sourceLink: "https://zenith.dev",
    problem:
      "Legacy platform suffered from high query latency (8000ms+) and client-side rendering bottlenecks across large analytical dashboards.",
    solution:
      "Rearchitected backend with Prisma 7 driver adapters and Next.js 16 Server Components to execute zero-bundle data access.",
    architecture:
      "Domain-driven micro-frontend architecture backed by PostgreSQL read replicas, Redis cache layer, and automated Vercel deployment pipelines.",
    challenge:
      "Migrating legacy database schemas while maintaining 99.99% uptime required zero-downtime shadow database testing and strict migration scripts.",
    result:
      "Reduced dashboard latency to 180ms (97% speedup), improved Core Web Vitals score to 99/100, and cut cloud hosting overhead by 40%.",
    createdAt: new Date("2026-06-01"),
  },
  {
    id: "proj-2",
    title: "Kaizen Design System",
    slug: "kaizen-design-system",
    category: "Design System & UI Library",
    description:
      "Japanese minimalist editorial design system for scalable web applications featuring soft warm palettes and accessible micro-interactions.",
    thumbnail: "/projects/kaizen.jpg",
    techstack: ["React 19", "TypeScript", "TailwindCSS v4", "Framer Motion"],
    repository: "https://github.com/zaenalalfian/kaizen-ui",
    sourceLink: "https://kaizen-ui.dev",
    problem:
      "Inconsistent UI component implementations across 12 product modules caused severe code duplication and brand inconsistency.",
    solution:
      "Architected 35 atomic design components with zero hardcoded CSS styles using CSS variable tokens and Framer Motion primitives.",
    architecture:
      "Tree-shakeable ESM module structure with strict TypeScript interfaces, automated accessibility linting, and Storybook documentation.",
    challenge:
      "Designing responsive layout components that seamlessly preserve traditional Japanese typography hierarchy without breaking mobile layouts.",
    result:
      "Decreased frontend bundle size by 35% and accelerated new feature delivery speed by 3x across engineering teams.",
    createdAt: new Date("2026-05-15"),
  },
  {
    id: "proj-3",
    title: "Shuri Docs & Knowledge Engine",
    slug: "shuri-docs-engine",
    category: "Documentation Platform",
    description:
      "High-speed MDX-powered documentation platform with dynamic TOC, instant search, and code highlight optimizations.",
    thumbnail: "/projects/shuri.jpg",
    techstack: ["Next.js 16", "MDX", "gray-matter", "TailwindCSS v4", "TypeScript"],
    repository: "https://github.com/zaenalalfian/shuri-docs",
    sourceLink: "https://shuri-docs.dev",
    problem:
      "Engineering documentation was scattered across separate git repositories with zero search indexing or unified table of contents.",
    solution:
      "Built a unified Next.js 16 MDX documentation engine with frontmatter parsing, client-side fuzzy search, and auto-generated TOCs.",
    architecture:
      "Static ISR page generation combining gray-matter markdown parser, syntax highlighting pipelines, and responsive sidebar layouts.",
    challenge:
      "Optimizing client-side search indexing for large documentation sets without increasing initial JavaScript bundle size.",
    result:
      "Unified 200+ technical guides into a single indexable platform with sub-50ms search query response times.",
    createdAt: new Date("2026-04-20"),
  },
];

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({ select: { slug: true } });
    if (projects.length > 0) {
      return projects.map((p) => ({ slug: p.slug }));
    }
  } catch (e) {
    // Ignore error
  }
  return fallbackProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  let project: any = null;

  try {
    project = await prisma.project.findUnique({
      where: { slug: resolvedParams.slug },
    });
  } catch (e) {
    // Fallback search
  }

  if (!project) {
    project = fallbackProjects.find((p) => p.slug === resolvedParams.slug);
  }

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Case Study | Zaenal Alfian`,
    description: project.description,
    keywords: [project.category, ...project.techstack, "Case Study", "Full-Stack Architecture"],
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  let project: any = null;

  try {
    project = await prisma.project.findUnique({
      where: { slug: resolvedParams.slug },
    });
  } catch (e) {
    // Fallback search
  }

  if (!project) {
    project = fallbackProjects.find((p) => p.slug === resolvedParams.slug);
  }

  if (!project) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-12">
          {/* Header */}
          <ProjectHeader
            title={project.title}
            category={project.category}
            description={project.description}
            techstack={project.techstack}
            repository={project.repository}
            sourceLink={project.sourceLink}
            createdAt={project.createdAt}
          />

          {/* Screenshot Gallery Carousel */}
          <ProjectGallery title={project.title} images={project.images} />

          {/* Case Study Details */}
          <ProjectCaseStudy
            problem={project.problem}
            solution={project.solution}
            architecture={project.architecture}
            challenge={project.challenge}
            result={project.result}
          />
        </Container>
      </div>
    </MainLayout>
  );
}
