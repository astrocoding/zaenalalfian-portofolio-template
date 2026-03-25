import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Code2, Sparkles, Terminal, CheckCircle2, Award, Briefcase, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Engineering Philosophy | Zaenal Alfian",
  description:
    "Learn about Zaenal Alfian's background as a Senior Full-Stack Engineer & Frontend Architect, technical philosophy, and software craftsmanship.",
  keywords: [
    "Zaenal Alfian",
    "About Engineer",
    "Full-Stack Architect",
    "Japanese Minimalist Design",
    "Next.js 16",
    "TypeScript",
  ],
};

const philosophyPillars = [
  {
    number: "01",
    title: "Ma (間) — Intentional Space",
    description:
      "Codebases and user interfaces thrive when clutter is removed. By honoring negative space and clean domain boundaries, software becomes easier to reason about, maintain, and scale.",
  },
  {
    number: "02",
    title: "Wabi-Sabi (侘寂) — Elegant Simplicity",
    description:
      "Perfection in software isn't achieved when there's nothing more to add, but when there's nothing left to take away. Simple, type-safe architecture beats complex abstractions every time.",
  },
  {
    number: "03",
    title: "Shokunin (職人) — Technical Craftsmanship",
    description:
      "Approaching software development as a lifelong craft. Every database index, API payload, and UI component is executed with meticulous care for performance and accessibility.",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-16">
          {/* Header Banner */}
          <div className="space-y-4 border-b border-border-warm pb-8">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              自己紹介 • BIOGRAPHY & PHILOSOPHY
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
              Behind the Architecture
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-sans max-w-3xl">
              I am <strong className="text-ink">Zaenal Alfian</strong>, a Senior Full-Stack Engineer and Frontend Architect with over 6 years of experience building mission-critical web applications, enterprise design systems, and high-performance serverless backends.
            </p>
          </div>

          {/* Extended Bio Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6 text-ink-muted leading-relaxed font-sans text-base">
              <h2 className="text-2xl font-serif font-bold text-ink">
                Bridging Design Vision & Technical Execution
              </h2>
              <p>
                My journey in software development is rooted in a passion for craftsmanship. Over the past 6+ years, I have architected web platforms that serve millions of requests, led engineering teams in adopting modern frameworks like Next.js 16 and React 19, and built domain-driven design systems from scratch.
              </p>
              <p>
                My philosophy is heavily influenced by traditional Japanese minimalism (*Wabi-Sabi* & *Ma*) — eliminating unnecessary clutter to let core function and performance shine. Every line of code, database query, and UI component is crafted with intentionality.
              </p>
              <p>
                Whether designing micro-frontends, optimizing PostgreSQL query access with Prisma 7, or fine-tuning Core Web Vitals to 99/100 scores, I focus on delivering long-term architectural longevity and delightful user experiences.
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="lg:col-span-5 bg-surface border border-border-warm rounded-2xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-lg">
                  才
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">Zaenal Alfian</h3>
                  <p className="text-xs font-mono text-ink-muted">Senior Full-Stack Architect</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-ink-muted">Location:</span>
                  <span className="text-ink font-bold">Indonesia (Remote Worldwide)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-ink-muted">Experience:</span>
                  <span className="text-ink font-bold">6+ Years Engineering</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-ink-muted">Core Focus:</span>
                  <span className="text-primary font-bold">Next.js 16, React 19, PostgreSQL</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-ink-muted">Availability:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Available
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/#contact" className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-center" icon={<Mail className="w-4 h-4" />}>
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Philosophy Pillars Section */}
          <div className="space-y-8 pt-6 border-t border-border-warm">
            <div>
              <span className="font-serif text-primary/60 tracking-widest text-xs font-semibold uppercase block">
                美学 • PHILOSOPHY PILLARS
              </span>
              <h2 className="text-3xl font-serif font-bold text-ink mt-1">
                Core Engineering Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {philosophyPillars.map((pillar) => (
                <Card key={pillar.number} hoverEffect className="bg-surface p-6 space-y-3">
                  <span className="text-2xl font-serif font-bold text-primary/40 block">
                    {pillar.number}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-ink">{pillar.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-8 rounded-2xl bg-surface border border-border-warm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
            <div>
              <h3 className="text-xl font-serif font-bold text-ink">Interested in working together?</h3>
              <p className="text-xs text-ink-muted font-sans mt-1">
                Let's discuss architecture consulting, senior engineering roles, or custom web development projects.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/#projects">
                <Button variant="outline" size="md">
                  View Projects
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Start Conversation
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
