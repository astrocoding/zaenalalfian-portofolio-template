"use client";

import * as React from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
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
      sectionTitle="Technical Capabilities"
      sectionDescription="Comprehensive toolset honed across years of full-stack engineering and product deployment."
      bgVariant="paper"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <Card key={category.title} hoverEffect className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
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
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
