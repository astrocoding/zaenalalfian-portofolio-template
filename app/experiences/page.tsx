import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { TimelineCardList, TimelineCardItem } from "@/components/ui/TimelineCardList";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional Experiences & Career Journey | Zaenal Alfian",
  description:
    "Explore Zaenal Alfian's career history as Lead & Full-Stack Developer, Backend Engineering roles, technical accomplishments, and career timeline.",
  keywords: [
    "Zaenal Alfian Experience",
    "Full-Stack Developer Career",
    "Lead Developer",
    "Work History",
    "Zaenal Alfian",
  ],
};

const experienceItems: TimelineCardItem[] = [
  {
    title: "Lead & Full-Stack Developer",
    organization: "Cipta Grafika",
    location: "Karawang (On-site)",
    period: "Dec 2024 — Present",
    isCurrent: true,
    statusBadge: "現職 • Present",
    type: "experience",
    description:
      "Architected a three-tier architecture for ERP system using Node.js & Hapi, React, PostgreSQL, and Redis. Improving system performance by 150% compared from legacy code. Developed and deployed a web-based employee attendance system using barcode scanning integrated with payroll management in Laravel. This reduced HR's time spent on attendance reconciliation by 65% compared to legacy tap machines and Excel-based reporting.",
    highlights: [
      "Architected 3-tier enterprise ERP system using Node.js/Hapi, React, PostgreSQL & Redis (+150% performance speedup).",
      "Developed barcode-scanned employee attendance system integrated with payroll in Laravel (65% HR reconciliation time saved).",
      "Led end-to-end database modeling, Redis caching strategies, and REST API architectural standards.",
    ],
    tags: ["Node.js", "Hapi.js", "React", "Laravel", "PostgreSQL", "Redis"],
  },
  {
    title: "Backend Developer Intern",
    organization: "SchoolTech Indonesia",
    location: "Malang (Remote)",
    period: "Aug 2024 — Dec 2024",
    statusBadge: "完了 • Completed",
    type: "experience",
    description:
      "Contributed to backend development of InternPro, a web-based internship platform for vocational high school students, using Laravel. Collaborated closely with Frontend Developers, System Analysts, Project Managers, and QA teams to deliver features aligned with specifications and timelines.",
    highlights: [
      "Engineered RESTful API endpoints for InternPro vocational internship platform using Laravel & MySQL.",
      "Cross-functional collaboration with QA, UI/UX, and Project Managers in Agile sprint workflows.",
      "Optimized database queries and API response times for seamless student onboarding.",
    ],
    tags: ["Laravel", "PHP", "REST API", "MySQL", "Agile"],
  },
  {
    title: "Full-Stack Developer",
    organization: "Kodetopia Indonesia",
    location: "Karawang (Hybrid)",
    period: "Feb 2023 — Mar 2024",
    statusBadge: "完了 • Completed",
    type: "experience",
    description:
      "Developed custom web applications based on client requirements using diverse technology stacks including Laravel, React, Express, MySQL, and PostgreSQL. Involved in end-to-end development, from requirements analysis to deployment, with a strong focus on deadlines and coding standards. Collaborated in Agile teams, regularly participating in sprint planning, code reviews, and continuous integration.",
    highlights: [
      "Built client custom web applications using Laravel, React, Express, MySQL, and PostgreSQL.",
      "Managed end-to-end SDLC from requirements analysis, architectural design, to deployment.",
      "Participated in Agile sprint planning, technical code reviews, and continuous integration.",
    ],
    tags: ["Laravel", "React", "Express.js", "MySQL", "PostgreSQL", "CI/CD"],
  },
];

export default function ExperiencesPage() {
  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-12">
          {/* Page Header */}
          <div className="space-y-4 pb-2">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              職務経歴 • CAREER HISTORY &amp; TIMELINE
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
              Professional Journey
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-sans max-w-3xl">
              A detailed history of leading software development, architecture decisions, database optimizations, and full-stack engineering execution across companies.
            </p>
          </div>

          {/* Reusable Timeline Component */}
          <TimelineCardList items={experienceItems} type="experience" />

          {/* Bottom Action Footer */}
          <div className="p-8 rounded-2xl bg-surface border border-border-warm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
            <div>
              <h3 className="text-xl font-serif font-bold text-ink">Ready to collaborate?</h3>
              <p className="text-xs text-ink-muted font-sans mt-1">
                Open for full-stack engineering roles, technical architecture consulting, and high-impact web development projects.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/education">
                <Button variant="outline" size="md">
                  View Education
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="primary" size="md" icon={<Mail className="w-4 h-4" />}>
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
