import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CardCornerSeigaiha } from "@/components/ui/CardCornerSeigaiha";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionFooter } from "@/components/ui/ActionFooter";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  CATEGORY_META,
  DEFAULT_SKILL_CATEGORIES,
} from "@/components/sections/SkillsSection";
import { Code, FileText, Layers } from "lucide-react";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About & Engineering Philosophy | Zaenal Alfian",
  description:
    "Learn about Zaenal Alfian's background as a Senior Full-Stack Engineer & Frontend Architect, technical philosophy, and software craftsmanship.",
  keywords: [
    "Zaenal Alfian",
    "About Engineer",
    "Full-Stack Architect",
    "Japanese Minimalist Design",
    "Next.js",
    "TypeScript",
  ],
  alternates: {
    canonical: buildCanonical("/about"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/about"),
    title: "About & Engineering Philosophy | Zaenal Alfian",
    description:
      "Senior Full-Stack Engineer & Frontend Architect — 6+ years building scalable web platforms with optimized precision.",
    images: [
      {
        url: DEFAULT_OG_IMAGE(),
        width: 1200,
        height: 630,
        alt: "Zaenal Alfian About",
      },
    ],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "About & Engineering Philosophy | Zaenal Alfian",
    description:
      "Senior Full-Stack Engineer & Frontend Architect — building scalable systems with optimized precision.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function AboutPage() {
  let aboutData = null;
  let adminUser = null;
  let dbSkillsets: Awaited<ReturnType<typeof prisma.skillset.findMany>> = [];

  try {
    aboutData = await prisma.about.findFirst({
      include: {
        cards: {
          orderBy: { order: "asc" },
        },
      },
    });
    adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
    });
    dbSkillsets = await prisma.skillset.findMany({
      orderBy: [{ categoryOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    console.warn(
      "Failed to fetch About/User/Skillsets record from database:",
      e,
    );
  }

  const userName = adminUser?.name || "Zaenal Alfian";
  const userPosition = adminUser?.position || "Full-Stack Engineer";
  const userLocation = adminUser?.location || "Indonesia (Remote Worldwide)";
  const userExperience = adminUser?.experience || "6+ Years Engineering";
  const userAvailability = adminUser?.availability || "Available";
  const resumeUrl = adminUser?.resume?.trim();

  const title = aboutData?.title || "Behind the Architecture";
  const subtitle =
    aboutData?.subtitle || "Building products with clarity & longevity";
  const excerpt =
    aboutData?.excerpt ||
    "I am a dedicated software engineer with a strong commitment to continuous learning and professional growth. I enjoy building scalable and optimized solutions.";
  const rawDescription =
    aboutData?.description ||
    "My journey in software development is rooted in a passion for craftsmanship. Over the past 6+ years, I have architected web platforms that serve millions of requests, led engineering teams in adopting modern frameworks like Next.js 16 and React 19, and built domain-driven design systems from scratch.\n\nMy philosophy is heavily influenced by traditional Japanese minimalism (*Wabi-Sabi* & *Ma*) — eliminating unnecessary clutter to let core function and performance shine. Every line of code, database query, and UI component is crafted with intentionality.\n\nWhether designing micro-frontends, optimizing PostgreSQL query access with Prisma 7, or fine-tuning Core Web Vitals to 99/100 scores, I focus on delivering long-term architectural longevity and delightful user experiences.";

  const paragraphs: string[] = rawDescription
    .split("\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

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
      : DEFAULT_SKILL_CATEGORIES;

  const cards = aboutData?.cards || [];

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-10">
          {/* Header Banner */}
          <div className="space-y-4 border-b border-border-warm pb-8">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              自己紹介 • BIOGRAPHY &amp; PHILOSOPHY
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
              {title}
            </h1>
            {/* Bio Excerpt with Quote UI Styling matching Blog Header Quote UI */}
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-serif italic w-full border-l-2 sm:border-l-4 border-primary/40 pl-4 py-1.5 bg-primary/5 rounded-r-lg">
              &quot;{excerpt}&quot;
            </p>
          </div>

          {/* Extended Bio Story & Quick Stats Side-by-Side Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Extended Bio Story */}
            <div className="lg:col-span-7 space-y-6 text-ink-muted leading-relaxed font-sans text-base">
              <h2 className="text-2xl font-serif font-bold text-primary">
                {subtitle}
              </h2>
              {paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Right Column: Quick Stats Card */}
            <div className="lg:col-span-5 bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 space-y-5 shadow-card w-full max-w-[420px] lg:justify-self-end">
              <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
                <Image
                  src="/zen.svg?v=2"
                  alt="Zaenal Alfian Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">
                    {userName}
                  </h3>
                  <p className="text-xs font-mono text-ink-muted">
                    {userPosition}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Location:</span>
                  <span className="text-ink font-bold text-right">
                    {userLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Experience:</span>
                  <span className="text-primary font-bold text-right">
                    {userExperience} Years
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Availability:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-right shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{userAvailability}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      Get My Resume
                    </Button>
                  </a>
                ) : (
                  <Link href="/#contact" className="w-full block">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      Get My Resume
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 1: Philosophy Pillars Section (About Cards: Clean Architecture, High Performance, Ma, Wabi-Sabi) */}
          <div className="space-y-6 pt-6 border-t border-border-warm">
            <div>
              <span className="font-serif text-primary/60 tracking-widest text-xs font-semibold uppercase block">
                美学 • PHILOSOPHY PILLARS
              </span>
              <h2 className="text-3xl font-serif font-bold text-ink mt-1">
                Core Engineering Principles
              </h2>
            </div>

            {cards.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="There are no values or pillars posted yet"
                subtitleKanji="データなし"
                description="Engineering principles and core values will appear here once published from the admin panel."
                className="my-0"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map(
                  (
                    pillar: {
                      id?: string;
                      badge?: string | null;
                      title: string;
                      subtitle: string;
                      icon?: string | null;
                    },
                    idx: number,
                  ) => (
                    <Card
                      key={pillar.id || idx}
                      hoverEffect
                      className="bg-surface p-6 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {pillar.badge && (
                          <span className="text-2xl font-serif font-bold text-primary/40 block">
                            {pillar.badge}
                          </span>
                        )}
                        <div className="p-2 rounded-md bg-[#f6e0ce]/30 border border-[#ebd9c8]/50 shrink-0">
                          <DynamicIcon
                            name={pillar.icon}
                            className="w-5 h-5 text-primary"
                          />
                        </div>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-primary">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed font-sans">
                        {pillar.subtitle}
                      </p>
                    </Card>
                  ),
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: Technical Skillsets Section (Skill Categories Cards) */}
          <div className="space-y-6 pt-10 border-t border-border-warm">
            <div>
              <span className="font-serif text-primary/60 tracking-widest text-xs font-semibold uppercase block">
                技術 • TECHNICAL SKILLSETS
              </span>
              <h2 className="text-3xl font-serif font-bold text-ink mt-1">
                Technical Skillset &amp; Competencies
              </h2>
            </div>

            {skillCategories.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="There are no skills or competencies posted yet"
                subtitleKanji="データなし"
                description="Technical skills will appear here once published."
                className="my-0"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillCategories.map((category) => {
                  const meta = CATEGORY_META[category.title] || {
                    kanji:
                      "kanji" in category ? (category.kanji as string) : "技能",
                    icon:
                      "icon" in category ? (
                        (category.icon as React.ReactNode)
                      ) : (
                        <Code className="w-5 h-5 text-primary" />
                      ),
                  };

                  return (
                    <Card
                      key={category.title}
                      hoverEffect
                      className="relative overflow-hidden p-6 bg-surface"
                    >
                      {/* Bottom-right diagonal Seigaiha wave accent */}
                      <CardCornerSeigaiha cardBgColor="#ffffff" />

                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between pb-4 mb-2 border-b border-border-subtle">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded bg-[#f6e0ce]/50 border border-border-warm">
                              {"icon" in category && category.icon
                                ? (category.icon as React.ReactNode)
                                : meta.icon}
                            </div>
                            <h3 className="text-lg font-bold font-serif text-ink">
                              {category.title}
                            </h3>
                          </div>
                          <span className="font-serif text-xs text-primary font-semibold uppercase">
                            {"kanji" in category && category.kanji
                              ? (category.kanji as string)
                              : meta.kanji}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => {
                            const skillName =
                              typeof skill === "string"
                                ? skill
                                : skill.skillName;
                            const skillKey =
                              typeof skill === "string"
                                ? skill
                                : skill.id || skill.skillName;

                            return (
                              <Badge key={skillKey} variant="tech" size="md">
                                {skillName}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reusable Bottom Action Footer */}
          <ActionFooter
            title="Interested in working together?"
            description="Let's discuss architecture consulting, senior engineering roles, or custom web development projects."
            secondaryButtonText="My Projects"
            secondaryButtonHref="/projects"
            primaryButtonText="Start Conversation"
            primaryButtonHref="/#contact"
          />
        </Container>
      </div>
    </MainLayout>
  );
}
