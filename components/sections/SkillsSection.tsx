"use client";

import * as React from "react";
import { SectionWrapper, Card, Badge, CardCornerSeigaiha } from "../ui";
import { Code, Database, Layers, Wrench } from "lucide-react";
import contentData from "@/data/content.json";
import mockupData from "@/data/mockup.json";

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

export const CATEGORY_META: Record<
  string,
  { kanji: string; icon: React.ReactNode }
> = {
  "Frontend Engineering": {
    kanji: contentData.skills.categoryMeta["Frontend Engineering"].kanji,
    icon: <Code className="w-5 h-5 text-primary" />,
  },
  "Backend & Database": {
    kanji: contentData.skills.categoryMeta["Backend & Database"].kanji,
    icon: <Database className="w-5 h-5 text-primary" />,
  },
  "Backend & Databases": {
    kanji: contentData.skills.categoryMeta["Backend & Databases"].kanji,
    icon: <Database className="w-5 h-5 text-primary" />,
  },
  "Architecture & DevOps": {
    kanji: contentData.skills.categoryMeta["Architecture & DevOps"].kanji,
    icon: <Layers className="w-5 h-5 text-primary" />,
  },
  "Tools & Methodologies": {
    kanji: contentData.skills.categoryMeta["Tools & Methodologies"].kanji,
    icon: <Wrench className="w-5 h-5 text-primary" />,
  },
};

const categoryIcons = [
  <Code key="code" className="w-5 h-5 text-primary" />,
  <Database key="db" className="w-5 h-5 text-primary" />,
  <Layers key="layers" className="w-5 h-5 text-primary" />,
  <Wrench key="wrench" className="w-5 h-5 text-primary" />,
];

export const DEFAULT_SKILL_CATEGORIES: SkillCategoryGroup[] = mockupData.skillCategories.map((cat, idx) => ({
  title: cat.title,
  kanji: cat.kanji,
  icon: categoryIcons[idx] || <Code key={idx} className="w-5 h-5 text-primary" />,
  skills: cat.skills,
}));

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillCategories: propsCategories,
}) => {
  const categoriesToRender = (
    propsCategories && propsCategories.length > 0
      ? propsCategories
      : DEFAULT_SKILL_CATEGORIES
  ).slice(0, 4);

  return (
    <SectionWrapper
      id="skills"
      kanjiSubtitle={contentData.skills.kanjiSubtitle}
      sectionTitle={contentData.skills.sectionTitle}
      sectionDescription={contentData.skills.sectionDescription}
      bgVariant="paper"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden"
    >
      {/* Subtle Japanese Watermark Accent matching paper bg (#fef0de) */}
      <div
        className="hidden md:block absolute top-8 sm:top-12 right-6 sm:right-16 font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.08em] select-none pointer-events-none z-0 leading-none text-[var(--color-watermark)] opacity-90"
        aria-hidden="true"
      >
        {contentData.skills.watermarkKanji}
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesToRender.map((category) => {
          const meta = CATEGORY_META[category.title] || {
            kanji: category.kanji || "技能",
            icon: category.icon || <Code className="w-5 h-5 text-primary" />,
          };

          return (
            <Card
              key={category.title}
              hoverEffect
              className="relative overflow-hidden p-6"
            >
              {/* Bottom-right diagonal Seigaiha wave accent - identical to experience cards */}
              <CardCornerSeigaiha cardBgColor="#ffffff" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-border-subtle">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-[#f6e0ce]/50 border border-border-warm">
                      {category.icon || meta.icon}
                    </div>
                    <h3 className="text-lg font-bold font-serif text-ink">
                      {category.title}
                    </h3>
                  </div>
                  <span className="font-serif text-xs text-primary font-semibold uppercase">
                    {category.kanji || meta.kanji}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.slice(0, 5).map((skill) => {
                    const skillName =
                      typeof skill === "string" ? skill : skill.skillName;
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
                  {category.skills.length > 5 && (
                    <Badge
                      variant="ghost"
                      size="md"
                      className="font-mono text-xs font-bold text-primary/90 bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors select-none"
                    >
                      +{category.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
