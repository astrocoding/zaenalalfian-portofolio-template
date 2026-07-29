import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { ProjectHeader, ProjectGallery, ProjectCaseStudy } from "@/components/project";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({ select: { slug: true } });
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  let project: Awaited<ReturnType<typeof prisma.project.findUnique>> = null;

  try {
    project = await prisma.project.findUnique({
      where: { slug: resolvedParams.slug },
    });
  } catch {
    // Database query fallback
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
  let project: Awaited<ReturnType<typeof prisma.project.findUnique>> = null;

  try {
    project = await prisma.project.findUnique({
      where: { slug: resolvedParams.slug },
    });
  } catch {
    // Database query fallback
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
            repository={project.repository ?? undefined}
            sourceLink={project.sourceLink ?? undefined}
            createdAt={project.createdAt}
          />

          {/* Screenshot Gallery Carousel */}
          <ProjectGallery title={project.title} images={project.images} />

          {/* Case Study Details */}
          <ProjectCaseStudy
            problem={project.problem ?? undefined}
            solution={project.solution ?? undefined}
            architecture={project.architecture ?? undefined}
            challenge={project.challenge ?? undefined}
            result={project.result ?? undefined}
          />
        </Container>
      </div>
    </MainLayout>
  );
}
