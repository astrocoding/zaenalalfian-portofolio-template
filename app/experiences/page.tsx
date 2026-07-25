import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";

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

export default function ExperiencesPage() {
  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-12">
          {/* Header Banner */}
          <div className="space-y-4 border-b border-border-warm pb-8">
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

          {/* Core Timeline Section */}
          <div className="bg-surface rounded-2xl border border-border-warm p-6 sm:p-10 shadow-card">
            <ExperienceSection />
          </div>

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
