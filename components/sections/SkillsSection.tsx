"use client";

import * as React from "react";
import { SectionWrapper, Card, Badge, CardCornerSeigaiha } from "../ui";
import { Code, Database, Layers, Wrench } from "lucide-react";

const skillCategories = [
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

export const SkillsSection: React.FC = () => {
  return (
    <SectionWrapper
      id="skills"
      kanjiSubtitle="技術スキル"
      sectionTitle="Technical Skillset"
      sectionDescription="Comprehensive toolset honed across years of full-stack engineering and product deployment."
      bgVariant="paper"
      className="relative overflow-hidden"
    >
      {/* Subtle Japanese Watermark Accent ("技術スキル") matching paper bg (#fef0de) */}
      <div
        className="hidden md:block absolute top-8 sm:top-12 right-6 sm:right-16 font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.08em] select-none pointer-events-none z-0 leading-none text-[var(--color-watermark)] opacity-90"
        aria-hidden="true"
      >
        技術スキル
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <Card key={category.title} hoverEffect className="relative overflow-hidden p-6">
            {/* Bottom-right diagonal Seigaiha wave accent - identical to experience cards */}
            <CardCornerSeigaiha cardBgColor="#ffffff" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-border-subtle">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded bg-[#f6e0ce]/50 border border-border-warm">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-ink">{category.title}</h3>
                </div>
                <span className="font-serif text-xs text-primary/50 font-semibold uppercase">
                  {category.kanji}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="tech" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
