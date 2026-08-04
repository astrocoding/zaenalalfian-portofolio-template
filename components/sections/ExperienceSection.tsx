"use client";

import Link from "next/link";
import { SectionWrapper, Badge, CardCornerSeigaiha, Button } from "../ui";
import { ArrowRight, Briefcase, Calendar } from "lucide-react";
import contentData from "@/data/content.json";
import mockupData from "@/data/mockup.json";

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  skills: string[];
}

const fallbackExperiences: ExperienceItem[] = mockupData.experiences;

export const ExperienceSection: React.FC<{
  experiences?: ExperienceItem[];
}> = ({ experiences = fallbackExperiences }) => {
  const displayList = (
    experiences.length > 0 ? experiences : fallbackExperiences
  ).slice(0, 3);

  return (
    <SectionWrapper
      id="experience"
      kanjiSubtitle={contentData.experience.kanjiSubtitle}
      sectionTitle={contentData.experience.sectionTitle}
      sectionDescription={contentData.experience.sectionDescription}
      headerAction={
        <Link href="/experiences">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {contentData.experience.ctaShowAll}
          </Button>
        </Link>
      }
      bgVariant="surface"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24"
    >
      <div className="relative pl-6 sm:pl-8 border-l-2 border-border-warm space-y-6 sm:space-y-7">
        {displayList.map((exp, idx) => (
          <div key={(exp.id || exp.role) + idx} className="relative group">
            {/* Timeline Japanese Seal Dot */}
            <div className="absolute -left-[24px] sm:-left-[32px] -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-surface border-2 border-primary group-hover:scale-110 transition-all flex items-center justify-center z-10 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-primary transition-colors" />
            </div>

            <div className="relative overflow-hidden bg-paper border border-border-warm rounded-xl p-6 hover:border-primary/40 transition-colors shadow-2xs">
              {/* Bottom-right diagonal Seigaiha wave accent */}
              <CardCornerSeigaiha cardBgColor="#fef0de" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-ink">
                      {exp.role}
                    </h3>
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
                      <span className="font-serif text-primary font-semibold">
                        {contentData.experience.currentGlyph}
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="text-sm text-ink-muted leading-relaxed font-sans line-clamp-2"
                  title={exp.description}
                >
                  {exp.description}
                </p>

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
