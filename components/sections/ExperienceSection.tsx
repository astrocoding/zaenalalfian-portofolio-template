"use client";

import * as React from "react";
import { SectionWrapper, Badge, CardCornerSeigaiha } from "../ui";
import { Briefcase, Calendar } from "lucide-react";

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  skills: string[];
}

const fallbackExperiences: ExperienceItem[] = [
  {
    role: "Lead Full-Stack Architect",
    company: "Apex Digital Systems",
    period: "2024 — Present",
    isCurrent: true,
    description:
      "Spearheaded the design system migration to Next.js 16 App Router and TailwindCSS v4. Reduced page load times by 45% and improved Core Web Vitals to 99/100.",
    skills: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma 7", "TailwindCSS"],
  },
  {
    role: "Senior Frontend Engineer",
    company: "Kurofune Technologies",
    period: "2022 — 2024",
    isCurrent: false,
    description:
      "Architected complex micro-frontend applications and real-time analytical dashboards. Led a team of engineers in establishing strict TypeScript conventions and CI/CD pipelines.",
    skills: ["React", "TypeScript", "GraphQL", "Docker", "TailwindCSS", "Jest"],
  },
  {
    role: "Full-Stack Developer",
    company: "Sakura Cloud Solutions",
    period: "2020 — 2022",
    isCurrent: false,
    description:
      "Developed high-throughput REST APIs, database schemas, and responsive web portals for enterprise clients in e-commerce and fintech.",
    skills: ["Node.js", "Express", "PostgreSQL", "React", "Redis"],
  },
];

export const ExperienceSection: React.FC<{ experiences?: ExperienceItem[] }> = ({
  experiences = fallbackExperiences,
}) => {
  const displayList = experiences.length > 0 ? experiences : fallbackExperiences;

  return (
    <SectionWrapper
      id="experience"
      kanjiSubtitle="職務経歴"
      sectionTitle="Professional Journey"
      sectionDescription="A history of leading software development, architecture decisions, and engineering execution."
      bgVariant="surface"
    >
      <div className="relative pl-6 sm:pl-8 border-l-2 border-border-warm space-y-12">
        {displayList.map((exp, idx) => (
          <div key={(exp.id || exp.role) + idx} className="relative group">
            {/* Timeline Japanese Seal Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary group-hover:bg-primary transition-colors flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white transition-colors" />
            </div>

            <div className="relative overflow-hidden bg-paper border border-border-warm rounded-xl p-6 hover:border-primary/40 transition-colors shadow-2xs">
              {/* Bottom-right diagonal Seigaiha wave accent */}
              <CardCornerSeigaiha cardBgColor="#fef0de" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-ink">{exp.role}</h3>
                    <div className="flex items-center space-x-2 text-sm text-primary font-medium mt-0.5">
                      <Briefcase className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-ink-muted font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    {exp.isCurrent && (
                      <span className="font-serif text-primary font-semibold">現職</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-ink-muted leading-relaxed font-sans">{exp.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((tech) => (
                    <Badge key={tech} variant="ghost" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
