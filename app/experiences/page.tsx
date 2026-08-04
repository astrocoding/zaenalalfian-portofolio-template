import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { TimelineCardList, TimelineCardItem } from "@/components/ui/TimelineCardList";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionFooter } from "@/components/ui/ActionFooter";
import { Briefcase } from "lucide-react";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

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
  alternates: {
    canonical: buildCanonical("/experiences"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/experiences"),
    title: "Professional Experiences & Career Journey | Zaenal Alfian",
    description:
      "6+ years of professional experience as Lead & Full-Stack Developer, building enterprise platforms and design systems.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian Career" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Experiences & Career Journey | Zaenal Alfian",
    description: "6+ years of experience as Lead & Full-Stack Developer building enterprise platforms.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function ExperiencesPage() {
  let experienceItems: TimelineCardItem[] = [];

  try {
    const dbExperiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });

    experienceItems = dbExperiences.map((item) => ({
      title: item.role,
      organization: item.company,
      period: item.period,
      isCurrent: item.isCurrent,
      statusBadge: item.isCurrent ? "現職 • Present" : "職歴 • Past Role",
      type: "experience",
      description: item.description,
      highlights: item.accomplishments && item.accomplishments.length > 0 ? item.accomplishments : undefined,
      tags: item.skills,
    }));
  } catch (error) {
    console.warn("Failed to fetch experience records from database:", error);
  }

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-10">
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

          {/* Reusable Timeline Component / Dynamic Empty State */}
          {experienceItems.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No career experience records posted yet / 職務経歴データはまだありません"
              description="Professional work history, engineering roles, and career milestones will appear here once published from the admin panel."
            />
          ) : (
            <TimelineCardList items={experienceItems} type="experience" />
          )}

          {/* Reusable Bottom Action Footer */}
          <ActionFooter
            title="Ready to collaborate?"
            description="Open for full-stack engineering roles, technical architecture consulting, and high-impact web development projects."
            secondaryButtonText="My Education"
            secondaryButtonHref="/education"
            primaryButtonText="Get in Touch"
            primaryButtonHref="/contact"
          />
        </Container>
      </div>
    </MainLayout>
  );
}
