import { MainLayout } from "@/components/layout";
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  FeaturedProjectsSection,
  LatestBlogsSection,
  ContactSection,
} from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let dbBlogs: Awaited<ReturnType<typeof prisma.blog.findMany>> = [];
  let dbExperiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];

  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    dbBlogs = await prisma.blog.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
    });
    dbExperiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    // Graceful fallback to static seed items when database is empty
  }

  const projects =
    dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          category: p.category,
          thumbnail: p.thumbnail,
          techstack: p.techstack,
          problem: p.problem ?? undefined,
          solution: p.solution ?? undefined,
        }))
      : undefined;

  const blogs =
    dbBlogs.length > 0
      ? dbBlogs.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          category: b.category,
          description: b.description,
          thumbnail: b.thumbnail,
          publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().split("T")[0] : "",
        }))
      : undefined;

  const experiences =
    dbExperiences.length > 0
      ? dbExperiences.map((e) => ({
          id: e.id,
          role: e.role,
          company: e.company,
          period: e.period,
          isCurrent: e.isCurrent,
          description: e.description,
          skills: e.skills,
        }))
      : undefined;

  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection experiences={experiences} />
      <FeaturedProjectsSection projects={projects} />
      <LatestBlogsSection blogs={blogs} />
      <ContactSection />
    </MainLayout>
  );
}
