import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About & Engineering Philosophy | Zaenal Alfian",
  description:
    "Learn about Zaenal Alfian's background as a Senior Full-Stack Engineer & Frontend Architect, technical philosophy, and software craftsmanship.",
  keywords: [
    "Zaenal Alfian",
    "About Engineer",
    "Full-Stack Architect",
    "Japanese Minimalist Design",
    "Next.js",
    "TypeScript",
  ],
  alternates: {
    canonical: buildCanonical("/about"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/about"),
    title: "About & Engineering Philosophy | Zaenal Alfian",
    description:
      "Senior Full-Stack Engineer & Frontend Architect — 6+ years building scalable web platforms with optimized precision.",
    images: [{ url: DEFAULT_OG_IMAGE(), width: 1200, height: 630, alt: "Zaenal Alfian About" }],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "About & Engineering Philosophy | Zaenal Alfian",
    description: "Senior Full-Stack Engineer & Frontend Architect — building scalable systems with optimized precision.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

const defaultPhilosophyPillars = [
  {
    badge: "01",
    title: "Ma (間) — Intentional Space",
    subtitle:
      "Codebases and user interfaces thrive when clutter is removed. By honoring negative space and clean domain boundaries, software becomes easier to reason about, maintain, and scale.",
  },
  {
    badge: "02",
    title: "Wabi-Sabi (侘寂) — Elegant Simplicity",
    subtitle:
      "Perfection in software isn't achieved when there's nothing more to add, but when there's nothing left to take away. Simple, type-safe architecture beats complex abstractions every time.",
  },
  {
    badge: "03",
    title: "Shokunin (職人) — Technical Craftsmanship",
    subtitle:
      "Approaching software development as a lifelong craft. Every database index, API payload, and UI component is executed with meticulous care for performance and accessibility.",
  },
];

export default async function AboutPage() {
  let aboutData = null;
  let adminUser = null;

  try {
    aboutData = await prisma.about.findFirst({
      include: {
        cards: {
          orderBy: { order: "asc" },
        },
      },
    });
    adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    console.warn("Failed to fetch About/User record from database:", e);
  }

  const userName = adminUser?.name || "Zaenal Alfian";
  const userPosition = adminUser?.position || "Full-Stack Engineer";
  const userLocation = adminUser?.location || "Indonesia (Remote Worldwide)";
  const userExperience = adminUser?.experience || "6+ Years Engineering";
  const userAvailability = adminUser?.availability || "Available";

  const title = aboutData?.title || "Behind the Architecture";
  const subtitle = aboutData?.subtitle || "Bridging Design Vision & Technical Execution";
  const excerpt =
    aboutData?.excerpt ||
    "I am Zaenal Alfian, a Senior Full-Stack Engineer and Frontend Architect with over 6 years of experience building mission-critical web applications, enterprise design systems, and high-performance serverless backends.";

  const rawDescription =
    aboutData?.description ||
    "My journey in software development is rooted in a passion for craftsmanship. Over the past 6+ years, I have architected web platforms that serve millions of requests, led engineering teams in adopting modern frameworks like Next.js 16 and React 19, and built domain-driven design systems from scratch.\n\nMy philosophy is heavily influenced by traditional Japanese minimalism (*Wabi-Sabi* & *Ma*) — eliminating unnecessary clutter to let core function and performance shine. Every line of code, database query, and UI component is crafted with intentionality.\n\nWhether designing micro-frontends, optimizing PostgreSQL query access with Prisma 7, or fine-tuning Core Web Vitals to 99/100 scores, I focus on delivering long-term architectural longevity and delightful user experiences.";

  const paragraphs: string[] = rawDescription
    .split("\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const cards =
    aboutData?.cards && aboutData.cards.length > 0
      ? aboutData.cards
      : defaultPhilosophyPillars;

  return (
    <MainLayout>
      <div className="py-12 sm:py-16 bg-paper">
        <Container size="default" className="space-y-16">
          {/* Header Banner */}
          <div className="space-y-4 border-b border-border-warm pb-8">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              自己紹介 • BIOGRAPHY &amp; PHILOSOPHY
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-sans max-w-3xl">
              {excerpt}
            </p>
          </div>

          {/* Extended Bio Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6 text-ink-muted leading-relaxed font-sans text-base">
              <h2 className="text-2xl font-serif font-bold text-ink">
                {subtitle}
              </h2>
              {paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Quick Stats Card */}
            <div className="lg:col-span-5 bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 space-y-5 shadow-card w-full max-w-[420px] lg:justify-self-end">
              <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
                <Image
                  src="/zen.svg?v=2"
                  alt="Zaenal Alfian Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">{userName}</h3>
                  <p className="text-xs font-mono text-ink-muted">{userPosition}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Location:</span>
                  <span className="text-ink font-bold text-right">{userLocation}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Experience:</span>
                  <span className="text-primary font-bold text-right">{userExperience}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle gap-4">
                  <span className="text-ink-muted shrink-0">Availability:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-right shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{userAvailability}</span>
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
              {cards.map((pillar: { id?: string; badge?: string | null; title: string; subtitle: string }, idx: number) => (
                <Card key={pillar.id || idx} hoverEffect className="bg-surface p-6 space-y-3">
                  {pillar.badge && (
                    <span className="text-2xl font-serif font-bold text-primary/40 block">
                      {pillar.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-serif font-bold text-ink">{pillar.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    {pillar.subtitle}
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
                Let&apos;s discuss architecture consulting, senior engineering roles, or custom web development projects.
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
