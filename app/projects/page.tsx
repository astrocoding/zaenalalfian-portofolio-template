import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { ActionFooter } from "@/components/ui/ActionFooter";
import { ProjectsPageLayout } from "@/components/project/ProjectsPageLayout";
import { prisma } from "@/lib/prisma";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Featured Projects & Portfolio | Zaenal Alfian",
  description:
    "A showcase of production web applications, architectural platforms, design systems, and technical open-source software.",
  keywords: ["Portfolio", "Web Applications", "Full-Stack Projects", "Next.js", "Zaenal Alfian"],
  alternates: {
    canonical: buildCanonical("/projects"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/projects"),
    title: "Featured Projects & Portfolio | Zaenal Alfian",
    description: "Production web applications, architectural platforms, and design systems by Zaenal Alfian.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian Projects" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured Projects & Portfolio | Zaenal Alfian",
    description: "Production web apps and architectural platforms by Zaenal Alfian.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function ProjectsPage() {
  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];

  try {
    dbProjects = await prisma.project.findMany({
      where: { status: "published" },
      orderBy: [{ priorityOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("Error fetching projects for ProjectsPage:", err);
  }

  const projects = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category,
    thumbnail: p.thumbnail,
    techstack: p.techstack,
    problem: p.problem ?? undefined,
    solution: p.solution ?? undefined,
  }));

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper min-h-screen">
        <Container size="wide" className="space-y-12">
          <ProjectsPageLayout projects={projects} />
          <ActionFooter
            title="Explore Technical Writings & Architecture Guides"
            description="Dive into articles on software craftsmanship, frontend engineering, database optimization, and system design."
            secondaryButtonText="My Blogs"
            secondaryButtonHref="/blogs"
            primaryButtonText="Get in Touch"
            primaryButtonHref="/#contact"
          />
        </Container>
      </div>
    </MainLayout>
  );
}
