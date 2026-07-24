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
    role: "Lead & Full-Stack Developer",
    company: "Cipta Grafika, Karawang (On-site)",
    period: "Dec 2024 — Present",
    isCurrent: true,
    description:
      "Architected a three-tier architecture for ERP system using Node.js & Hapi, React, PostgreSQL, and Redis, improving system performance by 150% compared to legacy code. Developed and deployed a web-based employee attendance system using barcode scanning integrated with payroll management in Laravel, reducing HR's time spent on attendance reconciliation by 65%.",
    skills: ["Node.js", "Hapi.js", "React", "Laravel", "PostgreSQL", "Redis"],
  },
  {
    role: "Backend Developer Intern",
    company: "SchoolTech Indonesia, Malang (Remote)",
    period: "Aug 2024 — Dec 2024",
    isCurrent: false,
    description:
      "Contributed to backend development of InternPro, a web-based internship platform for vocational high school students, using Laravel. Collaborated closely with Frontend Developers, System Analysts, Project Managers, and QA teams to deliver features aligned with specifications and timelines.",
    skills: ["Laravel", "PHP", "REST API", "MySQL", "Agile"],
  },
  {
    role: "Full-Stack Developer",
    company: "Kodetopia Indonesia, Karawang (Hybrid)",
    period: "Feb 2023 — Mar 2024",
    isCurrent: false,
    description:
      "Developed custom web applications based on client requirements using diverse technology stacks including Laravel, React, Express, MySQL, and PostgreSQL. Involved in end-to-end development from requirements analysis to deployment with a strong focus on deadlines, coding standards, sprint planning, and code reviews in Agile teams.",
    skills: ["Laravel", "React", "Express.js", "MySQL", "PostgreSQL", "CI/CD"],
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
