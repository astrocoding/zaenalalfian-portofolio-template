import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { TimelineCardList, TimelineCardItem } from "@/components/ui/TimelineCardList";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionFooter } from "@/components/ui/ActionFooter";
import { GraduationCap } from "lucide-react";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

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
  alternates: {
    canonical: buildCanonical("/education"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/education"),
    title: "Education & Academic Qualifications | Zaenal Alfian",
    description:
      "Bachelor of Computer Science and software engineering training background of Zaenal Alfian.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian Education" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education & Academic Qualifications | Zaenal Alfian",
    description: "Computer science degree and software engineering background of Zaenal Alfian.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function EducationPage() {
  let educationItems: TimelineCardItem[] = [];

  try {
    const dbEducations = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });

    educationItems = dbEducations.map((item) => ({
      title: item.title,
      organization: item.organization,
      location: item.location,
      period: item.period,
      statusBadge: item.statusBadge || undefined,
      gpaOrBadge: item.grades || undefined,
      type: "education",
      description: item.description,
      highlights: item.highlights,
      tags: item.courses,
    }));
  } catch (error) {
    console.warn("Failed to fetch education records from database:", error);
  }

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-10">
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

          {/* Reusable Timeline Component / Dynamic Empty State */}
          {educationItems.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No education records posted yet / 学歴データはまだありません"
              description="Academic qualifications and degrees will appear here once published from the admin panel."
            />
          ) : (
            <TimelineCardList items={educationItems} type="education" />
          )}

          {/* Reusable Bottom Action Footer */}
          <ActionFooter
            title="Explore Professional Career History"
            description="View industry experience, engineering leadership roles, and technical achievements."
            secondaryButtonText="My Experiences"
            secondaryButtonHref="/experiences"
            primaryButtonText="Contact Me"
            primaryButtonHref="/contact"
          />
        </Container>
      </div>
    </MainLayout>
  );
}
