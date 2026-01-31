"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArrowRight, Cpu, Layout, ShieldCheck, Zap } from "lucide-react";

const coreValues = [
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

export const AboutSection: React.FC = () => {
  return (
    <SectionWrapper id="about" bgVariant="surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Title + Bio Copy + CTA Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="font-serif text-primary/60 tracking-widest text-xs font-semibold uppercase block">
              自己紹介 • ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-ink tracking-tight leading-tight">
              About & Engineering Philosophy
            </h2>
            <div className="w-12 h-0.5 bg-primary/40 mt-3 rounded-full" />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink leading-tight">
              Engineering software with <span className="text-primary italic">clarity</span> & longevity.
            </h3>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
              I am a senior full-stack engineer with over 6 years of experience engineering complex web applications, design systems, and cloud infrastructure.
            </p>
            <div className="pt-2">
              <Link href="/about">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Read Full Bio & Background
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Core Value Cards Grid (Aligned horizontally with Section Header) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreValues.map((val) => (
            <Card key={val.title} hoverEffect className="p-4 sm:p-5 bg-paper">
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
                  {val.title}
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
