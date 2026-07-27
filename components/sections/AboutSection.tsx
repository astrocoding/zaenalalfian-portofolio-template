"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArrowRight, Cpu, Layout, ShieldCheck, Zap } from "lucide-react";

export interface AboutCardData {
  id?: string;
  title: string;
  subtitle: string;
  badge?: string | null;
}

export interface AboutSectionProps {
  aboutData?: {
    title?: string;
    subtitle?: string;
    excerpt?: string;
    cards?: AboutCardData[];
  } | null;
}

const defaultCoreValues: { icon: React.ReactNode; title: string; kanji: string; description: string }[] = [
  {
    icon: <Cpu className="w-5 h-5 text-primary" />,
    title: "Clean Architecture",
    kanji: "建築",
    description:
      "Strict separation of concerns, domain-driven boundaries, and maintainable codebases built to scale smoothly.",
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "High Performance",
    kanji: "高速",
    description:
      "Sub-second page loads, Server Component optimization, minimal bundle sizes, and pristine Core Web Vitals.",
  },
  {
    icon: <Layout className="w-5 h-5 text-primary" />,
    title: "Editorial UI/UX",
    kanji: "美学",
    description:
      "Thoughtful Japanese minimalist aesthetics, soft paper palettes, typography hierarchy, and smooth micro-interactions.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    title: "Technical Credibility",
    kanji: "信頼",
    description:
      "Type-safe contracts, automated testing, reliable database migrations, and production-ready deployments.",
  },
];

const getIconForBadge = (badge?: string | null, index: number = 0) => {
  if (badge === "建築" || index === 0) return <Cpu className="w-5 h-5 text-primary" />;
  if (badge === "高速" || index === 1) return <Zap className="w-5 h-5 text-primary" />;
  if (badge === "美学" || index === 2) return <Layout className="w-5 h-5 text-primary" />;
  if (badge === "信頼" || index === 3) return <ShieldCheck className="w-5 h-5 text-primary" />;
  return <Cpu className="w-5 h-5 text-primary" />;
};

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutData }) => {
  const subtitle = aboutData?.subtitle || "Build Products with clarity & longevity.";
  const excerpt =
    aboutData?.excerpt ||
    "I am a senior full-stack engineer with over 6 years of experience engineering complex web applications, design systems, and cloud infrastructure.";

  const cardsList =
    aboutData?.cards && aboutData.cards.length > 0
      ? aboutData.cards.slice(0, 6).map((card, idx) => ({
        icon: getIconForBadge(card.badge, idx),
        title: card.title,
        kanji: card.badge || `0${idx + 1}`,
        description: card.subtitle,
      }))
      : defaultCoreValues;

  return (
    <SectionWrapper id="about" bgVariant="surface" className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden">
      {/* Subtle Japanese Vertical Watermark Accent ("生き甲斐") matching surface bg */}
      <div
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 lg:left-8 xl:left-12 2xl:left-20 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.2em] whitespace-nowrap select-none pointer-events-none z-0 leading-none text-[var(--color-watermark-surface)] opacity-75"
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        aria-hidden="true"
      >
        生き甲斐
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Title + Bio Copy + CTA Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
              自己紹介 • ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-ink tracking-tight leading-tight">
              About &amp; <span className="text-primary">Code Philosophy</span>
            </h2>
            <div className="w-12 h-0.5 bg-primary/40 mt-3 rounded-full" />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink leading-tight">
              {subtitle}
            </h3>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
              {excerpt}
            </p>
            <div className="pt-2">
              <Link href="/about">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Read Full Bio &amp; Background
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cardsList.map((val, idx) => (
            <Card key={val.title + idx} hoverEffect className="p-4 sm:p-5 bg-paper">
              <CardHeader className="mb-1.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
                    {val.icon}
                  </div>
                  <span className="font-serif text-xs font-semibold text-primary/40 uppercase">
                    {val.kanji}
                  </span>
                </div>
                <CardTitle className="text-base font-bold font-serif mt-2.5 text-ink">
                  <span className="text-primary">{val.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <CardDescription className="text-xs leading-relaxed text-ink-muted">
                  {val.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
