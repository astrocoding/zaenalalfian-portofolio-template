import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { AlertCircle, CheckCircle2, Layers, ShieldAlert, Award, FileQuestion } from "lucide-react";
import contentData from "@/data/content.json";

export interface ProjectCaseStudyProps {
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenge?: string | null;
  result?: string | null;
}

export const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({
  problem,
  solution,
  architecture,
  challenge,
  result,
}) => {
  const allSections = [
    {
      title: contentData.projects.caseStudy.sections.problem,
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      content: problem?.trim(),
      accentBg: "bg-rose-50 border-rose-200",
    },
    {
      title: contentData.projects.caseStudy.sections.solution,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      content: solution?.trim(),
      accentBg: "bg-emerald-50 border-emerald-200",
    },
    {
      title: contentData.projects.caseStudy.sections.architecture,
      icon: <Layers className="w-5 h-5 text-primary" />,
      content: architecture?.trim(),
      accentBg: "bg-[#f6e0ce]/30 border-border-warm",
    },
    {
      title: contentData.projects.caseStudy.sections.challenge,
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      content: challenge?.trim(),
      accentBg: "bg-amber-50 border-amber-200",
    },
    {
      title: contentData.projects.caseStudy.sections.result,
      icon: <Award className="w-5 h-5 text-purple-600" />,
      content: result?.trim(),
      accentBg: "bg-purple-50 border-purple-200",
    },
  ];

  const activeSections = allSections.filter((sec) => Boolean(sec.content));

  const renderCaseStudyContent = (rawContent?: string | null) => {
    if (!rawContent) return null;
    const lines = rawContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return null;

    return (
      <ul className="space-y-2 text-sm text-ink-muted font-sans">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*\s]+/, "").trim();
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary font-bold text-base leading-none select-none mt-0.5">•</span>
              <span className="leading-relaxed flex-1">{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold font-serif text-ink">{contentData.projects.caseStudy.heading}</h2>
        <div className="h-0.5 flex-1 bg-border-warm rounded-full" />
      </div>

      {activeSections.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title={contentData.emptyStates.caseStudy.title}
          description={contentData.emptyStates.caseStudy.description}
          className="my-0"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeSections.map((sec) => (
            <Card key={sec.title} hoverEffect className="p-6 bg-surface">
              <CardHeader className="mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md border ${sec.accentBg}`}>{sec.icon}</div>
                  <CardTitle className="text-base font-bold font-serif text-ink">
                    {sec.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                {renderCaseStudyContent(sec.content)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
