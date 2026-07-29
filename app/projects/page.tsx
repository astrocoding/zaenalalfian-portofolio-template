import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { FeaturedProjectsSection } from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Featured Projects & Portfolio | Zaenal Alfian",
  description:
    "A showcase of production web applications, architectural platforms, design systems, and technical open-source software.",
};

export default async function ProjectsPage() {
  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];

  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database fallback
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
        <FeaturedProjectsSection projects={projects} />
      </div>
    </MainLayout>
  );
}
