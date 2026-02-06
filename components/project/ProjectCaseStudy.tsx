import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { AlertCircle, CheckCircle2, Layers, ShieldAlert, Award } from "lucide-react";

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
  const sections = [
    {
      title: "The Problem / 課題",
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      content:
        problem ||
        "Legacy software infrastructure suffered from slow query performance, heavy memory consumption, and rigid client-side rendering bottlenecks that resulted in poor user engagement.",
      accentBg: "bg-rose-50 border-rose-200",
    },
    {
      title: "Proposed Solution / 解決策",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      content:
        solution ||
        "Re-architected the application using Next.js 16 Server Components and Prisma 7 PostgreSQL driver adapters, establishing a zero-client-bundle data access strategy.",
      accentBg: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "System Architecture / システム構成",
      icon: <Layers className="w-5 h-5 text-primary" />,
      content:
        architecture ||
        "Domain-driven server architecture with hybrid SSR/ISR page generation, Redis caching layer, and clean database abstraction interfaces.",
      accentBg: "bg-[#f6e0ce]/30 border-border-warm",
    },
    {
      title: "Key Challenges / 技術的挑戦",
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      content:
        challenge ||
        "Migrating legacy database schemas while ensuring 99.99% uptime and zero data drift during deployment required sophisticated database migration pipelines.",
      accentBg: "bg-amber-50 border-amber-200",
    },
    {
      title: "Quantifiable Results / 成果",
      icon: <Award className="w-5 h-5 text-purple-600" />,
      content:
        result ||
        "Reduced page load latency by 75%, achieved a 99/100 Core Web Vitals score across mobile devices, and decreased server infrastructure costs by 40%.",
      accentBg: "bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold font-serif text-ink">Project Case Study / ケーススタディ</h2>
        <div className="h-0.5 flex-1 bg-border-warm rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => (
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
              <p className="text-sm leading-relaxed text-ink-muted font-sans">
                {sec.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
