"use client";

import * as React from "react";
import { SectionWrapper, Card, Badge, CardCornerSeigaiha } from "../ui";
import { Code, Database, Layers, Wrench } from "lucide-react";

export interface SkillItem {
  id?: string;
  skillName: string;
  link?: string | null;
  description?: string | null;
}

export interface SkillCategoryGroup {
  title: string;
  categoryOrder?: number;
  kanji?: string;
  icon?: React.ReactNode;
  skills: (string | SkillItem)[];
}

export interface SkillsSectionProps {
  skillCategories?: SkillCategoryGroup[];
}

const CATEGORY_META: Record<string, { kanji: string; icon: React.ReactNode }> = {
  "Frontend Engineering": {
    kanji: "フロントエンド",
    icon: <Code className="w-5 h-5 text-primary" />,
  },
  "Backend & Database": {
    kanji: "バックエンド",
    icon: <Database className="w-5 h-5 text-primary" />,
  },
  "Backend & Databases": {
    kanji: "バックエンド",
    icon: <Database className="w-5 h-5 text-primary" />,
  },
  "Architecture & DevOps": {
    kanji: "アーキテクチャ",
    icon: <Layers className="w-5 h-5 text-primary" />,
  },
  "Tools & Methodologies": {
    kanji: "ツール",
    icon: <Wrench className="w-5 h-5 text-primary" />,
  },
};

const DEFAULT_SKILL_CATEGORIES: SkillCategoryGroup[] = [
  {
    title: "Frontend Engineering",
    kanji: "フロントエンド",
    icon: <Code className="w-5 h-5 text-primary" />,
    skills: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "TailwindCSS v4",
      "Framer Motion",
      "State Management (Zustand)",
      "HTML5 / Semantic Web",
      "Web Performance (CWV)",
    ],
  },
  {
    title: "Backend & Database",
    kanji: "バックエンド",
    icon: <Database className="w-5 h-5 text-primary" />,
    skills: [
      "Node.js / Bun",
      "PostgreSQL",
      "Prisma 7 ORM",
      "RESTful & GraphQL APIs",
      "Server Actions",
      "Redis Caching",
      "Database Indexing",
      "Auth (NextAuth / Lucia)",
    ],
  },
  {
    title: "Architecture & DevOps",
    kanji: "アーキテクチャ",
    icon: <Layers className="w-5 h-5 text-primary" />,
    skills: [
      "Vercel Deployment",
      "Docker & Containers",
      "CI/CD Pipelines",
      "Microservice Patterns",
      "Edge Computing",
      "SEO Optimization",
      "Serverless Functions",
      "Monorepos (Turborepo)",
    ],
  },
  {
    title: "Tools & Methodologies",
    kanji: "ツール",
    icon: <Wrench className="w-5 h-5 text-primary" />,
    skills: [
      "Git & GitHub Actions",
      "Figma to Code",
      "Jest & React Testing Library",
      "Playwright End-to-End",
      "ESLint & Prettier",
      "Agile & Pair Programming",
      "Technical Documentation",
      "Design Systems",
    ],
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillCategories: propsCategories,
}) => {
  const categoriesToRender =
    propsCategories && propsCategories.length > 0
      ? propsCategories
      : DEFAULT_SKILL_CATEGORIES;

  return (
    <SectionWrapper
      id="skills"
      kanjiSubtitle="技術スキル"
      sectionTitle="Technical Skillset"
      sectionDescription="Comprehensive toolset honed across years of full-stack engineering and product deployment."
      bgVariant="paper"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden"
    >
      {/* Subtle Japanese Watermark Accent ("技術スキル") matching paper bg (#fef0de) */}
      <div
        className="hidden md:block absolute top-8 sm:top-12 right-6 sm:right-16 font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.08em] select-none pointer-events-none z-0 leading-none text-[var(--color-watermark)] opacity-90"
        aria-hidden="true"
      >
        技術スキル
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesToRender.map((category) => {
          const meta = CATEGORY_META[category.title] || {
            kanji: category.kanji || "技能",
            icon: category.icon || <Code className="w-5 h-5 text-primary" />,
          };

          return (
            <Card key={category.title} hoverEffect className="relative overflow-hidden p-6">
              {/* Bottom-right diagonal Seigaiha wave accent - identical to experience cards */}
              <CardCornerSeigaiha cardBgColor="#ffffff" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-border-subtle">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-[#f6e0ce]/50 border border-border-warm">
                      {category.icon || meta.icon}
                    </div>
                    <h3 className="text-lg font-bold font-serif text-ink">{category.title}</h3>
                  </div>
                  <span className="font-serif text-xs text-primary font-semibold uppercase">
                    {category.kanji || meta.kanji}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => {
                    const skillName = typeof skill === "string" ? skill : skill.skillName;
                    const skillKey = typeof skill === "string" ? skill : skill.id || skill.skillName;

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
    </SectionWrapper>
  );
};
