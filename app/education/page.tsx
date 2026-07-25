import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardCornerSeigaiha } from "@/components/ui/CardCornerSeigaiha";
import { GraduationCap, Calendar, Award, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Education & Academic Qualifications | Zaenal Alfian",
  description:
    "Explore Zaenal Alfian's educational background, computer science degree, software engineering training, and academic achievements.",
  keywords: [
    "Zaenal Alfian Education",
    "Computer Science Degree",
    "Software Engineering Qualifications",
    "Academic Background",
    "Zaenal Alfian",
  ],
};

interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  isGraduated: boolean;
  statusBadge: string;
  gpa?: string;
  description: string;
  highlights: string[];
  coursework: string[];
}

const educationData: EducationItem[] = [
  {
    degree: "Bachelor of Computer Science (S.Kom.)",
    field: "Informatics & Software Engineering",
    institution: "University / Higher Education Institute",
    location: "Indonesia",
    period: "2020 — 2024",
    isGraduated: true,
    statusBadge: "卒業 • Graduated",
    gpa: "GPA 3.85 / 4.00",
    description:
      "Specialized in Software Engineering, Database Systems Architecture, Distributed Web Applications, and Algorithm Optimization. Graduated with Honors (Cum Laude). Conducted final thesis research on high-performance web systems and microservices optimization.",
    highlights: [
      "Graduated with Academic Distinction (Cum Laude)",
      "Published Capstone Project on High-Performance Web System Architecture",
      "Active Leader in Computer Science & Software Engineering Student Guild",
    ],
    coursework: [
      "Software Engineering",
      "Database Systems & Design",
      "Web Technologies & Frameworks",
      "Data Structures & Algorithms",
      "Distributed Systems",
      "Object-Oriented Design (OOD)",
    ],
  },
  {
    degree: "Vocational High School Diploma (RPL)",
    field: "Software Engineering (Rekayasa Perangkat Lunak)",
    institution: "Vocational High School (SMK)",
    location: "Karawang, Indonesia",
    period: "2017 — 2020",
    isGraduated: true,
    statusBadge: "卒業 • Graduated",
    description:
      "Intensive 3-year technical vocational curriculum focused on practical software engineering fundamentals. Mastered client-server web programming, relational database management (MySQL), and modern web user interface development.",
    highlights: [
      "Ranked Top 3 Academic Graduate in Software Engineering Department",
      "Built Full-Stack Web Application for Vocational Final Project",
      "Completed Industrial Software Engineering Internship",
    ],
    coursework: [
      "Web Programming (HTML/CSS/JS)",
      "PHP & MySQL Database Management",
      "Object-Oriented Programming (OOP)",
      "System Analysis & Design",
      "Software Testing Basics",
    ],
  },
];

export default function EducationPage() {
  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-12">
          {/* Page Header */}
          <div className="space-y-4 border-b border-border-warm pb-8">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              学歴 • ACADEMIC BACKGROUND &amp; DEGREES
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
              Educational Journey
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-sans max-w-3xl">
              A comprehensive overview of formal computer science education, software engineering diplomas, academic achievements, and foundational coursework.
            </p>
          </div>

          {/* Timeline Container adopting Professional Journey Card Style */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-border-warm space-y-12 my-8">
            {educationData.map((edu, idx) => (
              <div key={edu.degree + idx} className="relative group">
                {/* Timeline Japanese Seal Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary group-hover:bg-primary transition-colors flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white transition-colors" />
                </div>

                <div className="relative overflow-hidden bg-surface border border-border-warm rounded-xl p-6 sm:p-8 hover:border-primary/40 transition-colors shadow-2xs space-y-5">
                  {/* Bottom-right diagonal Seigaiha wave accent */}
                  <CardCornerSeigaiha cardBgColor="#ffffff" />

                  {/* Header Row */}
                  <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink">
                        {edu.degree}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-primary font-medium">
                        <GraduationCap className="w-4 h-4" />
                        <span>{edu.institution}</span>
                        <span className="text-ink-muted/50">•</span>
                        <span className="text-ink-muted text-xs">{edu.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1 text-xs text-ink-muted font-mono">
                      <span className="flex items-center gap-1.5 bg-paper px-2.5 py-1 rounded border border-border-warm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {edu.period}
                      </span>
                      <span className="font-serif text-primary font-semibold text-xs pt-0.5">
                        {edu.statusBadge}
                      </span>
                    </div>
                  </div>

                  {/* Description & GPA */}
                  <div className="relative z-10 space-y-3">
                    {edu.gpa && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                        <Award className="w-3.5 h-3.5" />
                        {edu.gpa}
                      </div>
                    )}
                    <p className="text-sm text-ink-muted leading-relaxed font-sans">
                      {edu.description}
                    </p>
                  </div>

                  {/* Highlights Section */}
                  <div className="relative z-10 space-y-2 pt-2 border-t border-border-subtle">
                    <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      Academic Highlights &amp; Honors
                    </h3>
                    <ul className="space-y-1.5 text-xs text-ink-muted font-sans pl-1">
                      {edu.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coursework / Skills Badges */}
                  <div className="relative z-10 space-y-2 pt-2">
                    <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      Key Coursework &amp; Competencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {edu.coursework.map((course) => (
                        <Badge key={course} variant="ghost" size="sm">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="p-8 rounded-2xl bg-surface border border-border-warm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
            <div>
              <h3 className="text-xl font-serif font-bold text-ink">Explore Professional Career History</h3>
              <p className="text-xs text-ink-muted font-sans mt-1">
                View industry experience, engineering leadership roles, and technical achievements.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/experiences">
                <Button variant="outline" size="md">
                  View Experiences
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
