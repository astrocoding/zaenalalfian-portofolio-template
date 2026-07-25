import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { TimelineCardList, TimelineCardItem } from "@/components/ui/TimelineCardList";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

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

const educationItems: TimelineCardItem[] = [
  {
    title: "Bachelor of Computer Science (S.Kom.)",
    organization: "University / Higher Education Institute",
    location: "Indonesia",
    period: "2020 — 2024",
    statusBadge: "卒業 • Graduated",
    gpaOrBadge: "GPA 3.85 / 4.00",
    type: "education",
    description:
      "Specialized in Software Engineering, Database Systems Architecture, Distributed Web Applications, and Algorithm Optimization. Graduated with Honors (Cum Laude). Conducted final thesis research on high-performance web systems and microservices optimization.",
    highlights: [
      "Graduated with Academic Distinction (Cum Laude)",
      "Published Capstone Project on High-Performance Web System Architecture",
      "Active Leader in Computer Science & Software Engineering Student Guild",
    ],
    tags: [
      "Software Engineering",
      "Database Systems & Design",
      "Web Technologies & Frameworks",
      "Data Structures & Algorithms",
      "Distributed Systems",
      "Object-Oriented Design (OOD)",
    ],
  },
  {
    title: "Vocational High School Diploma (RPL)",
    organization: "Vocational High School (SMK)",
    location: "Karawang, Indonesia",
    period: "2017 — 2020",
    statusBadge: "卒業 • Graduated",
    type: "education",
    description:
      "Intensive 3-year technical vocational curriculum focused on practical software engineering fundamentals. Mastered client-server web programming, relational database management (MySQL), and modern web user interface development.",
    highlights: [
      "Ranked Top 3 Academic Graduate in Software Engineering Department",
      "Built Full-Stack Web Application for Vocational Final Project",
      "Completed Industrial Software Engineering Internship",
    ],
    tags: [
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
          <div className="space-y-4 pb-2">
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

          {/* Reusable Timeline Component */}
          <TimelineCardList items={educationItems} type="education" />

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
