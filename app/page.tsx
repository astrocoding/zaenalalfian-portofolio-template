import dynamic from "next/dynamic";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { prisma } from "@/lib/prisma";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

// Lazy load below-the-fold sections for maximum mobile performance & code splitting
const AboutSection = dynamic(() =>
  import("@/components/sections/AboutSection").then((m) => m.AboutSection)
);
const SkillsSection = dynamic(() =>
  import("@/components/sections/SkillsSection").then((m) => m.SkillsSection)
);
const ExperienceSection = dynamic(() =>
  import("@/components/sections/ExperienceSection").then((m) => m.ExperienceSection)
);
const FeaturedProjectsSection = dynamic(() =>
  import("@/components/sections/FeaturedProjectsSection").then(
    (m) => m.FeaturedProjectsSection
  )
);
const LatestBlogsSection = dynamic(() =>
  import("@/components/sections/LatestBlogsSection").then((m) => m.LatestBlogsSection)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/ContactSection").then((m) => m.ContactSection)
);

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
  description:
    "Personal portfolio of Zaenal Alfian — Senior Full-Stack Engineer & Frontend Architect specializing in Next.js, React, TypeScript, PostgreSQL, and Japanese minimalist design.",
  keywords: [
    "Zaenal Alfian",
    "Full-Stack Engineer",
    "Frontend Architect",
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Software Engineer Indonesia",
    "Japanese Minimalist Design",
  ],
  alternates: {
    canonical: buildCanonical("/"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/"),
    title: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
    description:
      "Personal portfolio of Zaenal Alfian — crafting scalable systems with optimized precision. Next.js, React 19, TypeScript, Prisma.",
    images: [
      {
        url: DEFAULT_OG_IMAGE(),
        width: 1200,
        height: 630,
        alt: "Zaenal Alfian — Senior Full-Stack Engineer",
      },
    ],
    siteName: "Zaenal Alfian Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
    description:
      "Crafting scalable systems with optimized precision. Next.js, React 19, TypeScript, Prisma.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default async function HomePage() {
  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let dbBlogs: Awaited<ReturnType<typeof prisma.blog.findMany>> = [];
  let dbExperiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let dbSkillsets: Awaited<ReturnType<typeof prisma.skillset.findMany>> = [];
  let dbAbout: Awaited<ReturnType<typeof prisma.about.findFirst>> = null;
  let dbAdminUser: (Awaited<ReturnType<typeof prisma.user.findFirst>> & {
    contact?: Awaited<ReturnType<typeof prisma.contact.findFirst>> | null;
  }) | null = null;

  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    dbBlogs = await prisma.blog.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    dbExperiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    dbSkillsets = await prisma.skillset.findMany({
      orderBy: [{ categoryOrder: "asc" }, { createdAt: "asc" }],
    });
    dbAbout = await prisma.about.findFirst({
      include: {
        cards: {
          orderBy: { order: "asc" },
        },
      },
    });
    dbAdminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      include: { contact: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    // Graceful fallback to static seed items when database is empty
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

  const blogs = dbBlogs.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category,
    description: b.description,
    thumbnail: b.thumbnail,
    publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().split("T")[0] : "",
  }));

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

  const skillCategoriesMap = new Map<
    string,
    {
      title: string;
      categoryOrder: number;
      skills: { id: string; skillName: string; link?: string | null; description?: string | null }[];
    }
  >();

  dbSkillsets.forEach((item) => {
    if (!skillCategoriesMap.has(item.category)) {
      skillCategoriesMap.set(item.category, {
        title: item.category,
        categoryOrder: item.categoryOrder,
        skills: [],
      });
    }
    skillCategoriesMap.get(item.category)?.skills.push({
      id: item.id,
      skillName: item.skillName,
      link: item.link,
      description: item.description,
    });
  });

  const skillCategories =
    dbSkillsets.length > 0
      ? Array.from(skillCategoriesMap.values()).sort(
          (a, b) => a.categoryOrder - b.categoryOrder
        )
      : undefined;

  return (
    <MainLayout>
      <HeroSection
        userData={
          dbAdminUser
            ? {
                name: dbAdminUser.name,
                position: dbAdminUser.position,
                activity: dbAdminUser.activity,
              }
            : undefined
        }
      />
      <AboutSection aboutData={dbAbout} />
      <SkillsSection skillCategories={skillCategories} />
      <ExperienceSection experiences={experiences} />
      <FeaturedProjectsSection projects={projects} />
      <LatestBlogsSection blogs={blogs} />
      <ContactSection
        contactData={
          dbAdminUser
            ? {
                name: dbAdminUser.name,
                position: dbAdminUser.position,
                gmail: dbAdminUser.contact?.gmail,
                location: dbAdminUser.location,
                availability: dbAdminUser.availability,
              }
            : undefined
        }
      />
    </MainLayout>
  );
}
