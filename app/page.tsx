import nextDynamic from "next/dynamic";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { prisma } from "@/lib/prisma";
import { getAllBlogPosts } from "@/lib/blogs";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

// Lazy load below-the-fold sections for maximum mobile performance & code splitting
const AboutSection = nextDynamic(() =>
  import("@/components/sections/AboutSection").then((m) => m.AboutSection),
);
const SkillsSection = nextDynamic(() =>
  import("@/components/sections/SkillsSection").then((m) => m.SkillsSection),
);
const ExperienceSection = nextDynamic(() =>
  import("@/components/sections/ExperienceSection").then(
    (m) => m.ExperienceSection,
  ),
);
const FeaturedProjectsSection = nextDynamic(() =>
  import("@/components/sections/FeaturedProjectsSection").then(
    (m) => m.FeaturedProjectsSection,
  ),
);
const LatestBlogsSection = nextDynamic(() =>
  import("@/components/sections/LatestBlogsSection").then(
    (m) => m.LatestBlogsSection,
  ),
);
const ContactSection = nextDynamic(() =>
  import("@/components/sections/ContactSection").then((m) => m.ContactSection),
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Zaenal Alfian — Full-Stack Engineer / Software Engineer",
  description:
    "Personal portfolio of Zaenal Alfian — Full-Stack Engineer / Software Engineer specializing in scalable systems and optimized solutions.",
  keywords: [
    "Zaenal Alfian",
    "Full-Stack Engineer",
    "Software Engineering",
    "Web Development",
    "System Design",
    "API Programming",
    "Data Engineering",
    "Developer Productivity",
    "Software Engineer Indonesia",
    "Software Developer Indonesia",
  ],
  alternates: {
    canonical: buildCanonical("/"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/"),
    title: "Zaenal Alfian — Full-Stack Engineer / Software Engineer",
    description:
      "Personal portfolio of Zaenal Alfian — Full-Stack Engineer / Software Engineer specializing in scalable systems and optimized solutions.",
    images: [
      {
        url: DEFAULT_OG_IMAGE(),
        width: 1200,
        height: 630,
        alt: "Zaenal Alfian — Full-Stack Engineer / Software Engineer",
      },
    ],
    siteName: "Zaenal Alfian Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaenal Alfian — Full-Stack Engineer / Software Engineer",
    description:
      "Full-Stack Engineer & Software Engineer. Crafting scalable systems with optimized precision.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function HomePage() {
  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let dbExperiences: Awaited<ReturnType<typeof prisma.experience.findMany>> =
    [];
  let dbSkillsets: Awaited<ReturnType<typeof prisma.skillset.findMany>> = [];
  let dbAbout: Awaited<ReturnType<typeof prisma.about.findFirst>> = null;
  let dbAdminUser:
    | (Awaited<ReturnType<typeof prisma.user.findFirst>> & {
      contact?: Awaited<ReturnType<typeof prisma.contact.findFirst>> | null;
    })
    | null = null;
  let totalProjectsCount = 0;
  let totalBlogsCount = 0;

  try {
    totalProjectsCount = await prisma.project.count();
    totalBlogsCount = await prisma.blog.count();
    dbProjects = await prisma.project.findMany({
      where: { status: "published" },
      orderBy: [{ priorityOrder: "asc" }, { createdAt: "desc" }],
      take: 4,
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
  } catch (err) {
    console.error("Error fetching HomePage database data:", err);
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

  const allBlogPosts = await getAllBlogPosts();
  const blogs = allBlogPosts.slice(0, 5).map((b) => ({
    id: b.frontmatter.slug,
    title: b.frontmatter.title,
    slug: b.frontmatter.slug,
    category: b.frontmatter.category,
    description: b.frontmatter.description,
    thumbnail: b.frontmatter.thumbnail,
    publishedAt: b.frontmatter.publishedAt,
    readingTime: b.readingTime,
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
      skills: {
        id: string;
        skillName: string;
        link?: string | null;
        description?: string | null;
      }[];
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
        (a, b) => a.categoryOrder - b.categoryOrder,
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
              resume: dbAdminUser.resume,
              experience: dbAdminUser.experience,
            }
            : undefined
        }
        stats={{
          totalProjects: totalProjectsCount,
          totalBlogs: totalBlogsCount,
        }}
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
