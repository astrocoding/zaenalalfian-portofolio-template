"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { Button, Badge, Container, SeigaihaPattern } from "../ui";
import { FadeIn } from "../ui/Motion";
import contentData from "@/data/content.json";
import mockupData from "@/data/mockup.json";

interface CounterNumberProps {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const CounterNumber: React.FC<CounterNumberProps> = ({
  from = 0,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  delay = 0.5,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = React.useState<string>(
    prefix + from.toFixed(decimals) + suffix,
  );

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1,
        );

        // Smooth Cubic Ease Out curve for fluid counting speed transition
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = from + (to - from) * easeProgress;

        setDisplayValue(prefix + currentValue.toFixed(decimals) + suffix);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [from, to, decimals, prefix, suffix, duration, delay]);

  return (
    <span className={className} suppressHydrationWarning>
      {displayValue}
    </span>
  );
};

const SeigaihaFan: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const radii = [40, 33, 26, 19, 12, 5];
  return (
    <g>
      {/* Solid Paper Fill Base to Mask Out Lower/Behind Layers */}
      <path
        d={`M ${cx - 40} ${cy} A 40 40 0 0 1 ${cx + 40} ${cy} Z`}
        fill="#fef0de"
      />
      {/* Concentric Arc Rings (1:1 Perfect Circular Semicircles) */}
      {radii.map((r) => (
        <path
          key={r}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
      ))}
    </g>
  );
};

export const SeigaihaWaveBorder: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20 h-[80px] ${className}`}
    >
      <svg
        className="w-full h-full text-primary/45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="seigaiha-hero-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* --- TIER 1: TOP STACK (y = 40, Top Peak touches y = 0 perfectly) --- */}
          <SeigaihaFan cx={0} cy={40} />
          <SeigaihaFan cx={80} cy={40} />
          <SeigaihaFan cx={-80} cy={40} />
          <SeigaihaFan cx={160} cy={40} />

          {/* --- TIER 2: MIDDLE STACK (y = 60) --- */}
          <SeigaihaFan cx={40} cy={60} />
          <SeigaihaFan cx={-40} cy={60} />
          <SeigaihaFan cx={120} cy={60} />

          {/* --- TIER 3: BOTTOM STACK (y = 80, Baseline touches y = 80 perfectly) --- */}
          <SeigaihaFan cx={0} cy={80} />
          <SeigaihaFan cx={80} cy={80} />
          <SeigaihaFan cx={-80} cy={80} />
          <SeigaihaFan cx={160} cy={80} />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#seigaiha-hero-pattern)"
        />
      </svg>
    </div>
  );
};

const DesktopArchitectureCard: React.FC<{
  name: string;
  role: string;
  status: string;
}> = ({ name, role, status }) => {
  return (
    <div className="w-full animate-float">
      {/* Japanese Minimalist Frame Container */}
      <div className="relative mx-auto max-w-md bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
        {/* Top Red Japanese Hanko Stamp Motif */}
        <div className="absolute top-4 right-4 w-9 h-9 border-2 border-primary/40 rounded flex items-center justify-center text-primary font-serif font-bold text-xs select-none opacity-80 rotate-12">
          印
        </div>

        {/* Code Snippet Box Header */}
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-border-subtle">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-ink-muted ml-2">
            {contentData.hero.architectureCard.fileLabel}
          </span>
        </div>

        {/* Mock Code Block */}
        <div className="space-y-1.5 font-mono text-xs text-ink leading-relaxed">
          <p className="text-primary font-semibold">{contentData.hero.architectureCard.comment}</p>
          <p>
            <span className="text-purple-600">const</span> developer = &#123;
          </p>
          <p className="pl-4">
            name: <span className="text-emerald-700">&quot;{name}&quot;</span>,
          </p>
          <p className="pl-4">
            role: <span className="text-emerald-700">&quot;{role}&quot;</span>,
          </p>
          <p className="pl-4">
            status: <span className="text-amber-700">&quot;{status}&quot;</span>
          </p>
          <p>&#125;;</p>
        </div>

        {/* Japanese Aesthetic Card Footer */}
        <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{contentData.hero.architectureCard.connectedLabel}</span>
          </div>
          <span className="font-serif text-primary font-semibold italic text-xs">
            {contentData.hero.architectureCard.kanjiFooter}
          </span>
        </div>
      </div>
    </div>
  );
};

export interface HeroSectionProps {
  userData?: {
    name?: string | null;
    position?: string | null;
    activity?: string | null;
    resume?: string | null;
    experience?: string | null;
  } | null;
  stats?: {
    totalProjects?: number;
    totalBlogs?: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userData,
  stats,
}) => {
  const name = userData?.name || mockupData.user.name;
  const role = userData?.position || mockupData.user.position;
  const status = userData?.activity || mockupData.user.activity;
  const resumeUrl = userData?.resume?.trim();

  // Extract numeric years experience from profile (e.g. "6+" or "6" -> 6)
  const rawExperience = userData?.experience?.trim();
  const experienceYears = rawExperience
    ? parseInt(rawExperience.replace(/[^0-9]/g, ""), 10) || mockupData.stats.experienceYears
    : mockupData.stats.experienceYears;

  const totalProjects = stats?.totalProjects ?? mockupData.stats.totalProjects;
  const totalBlogs = stats?.totalBlogs ?? mockupData.stats.totalBlogs;

  return (
    <section
      id="hero"
      className="relative w-full min-h-[calc(100svh-65px)] sm:min-h-[calc(100vh-65px)] lg:min-h-0 lg:h-[90vh] flex flex-col justify-between pt-1 sm:pt-3 lg:pt-[5px] pb-0 overflow-hidden bg-paper transform-gpu section-fade-in"
    >
      {/* Decorative Subtle Japanese Grid & Background Motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(#b04749_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Floating Vertical Kanji Accent (Right Side) */}
      <div className="hidden lg:block absolute top-16 right-12 font-serif text-primary/10 text-8xl font-bold tracking-widest pointer-events-none select-none writing-mode-vertical">
        {contentData.hero.kanjiAccent}
      </div>

      <Container
        size="wide"
        className="relative z-10 w-full flex-1 flex flex-col justify-between pt-0 pb-28 sm:pb-32 lg:pb-24 min-h-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 lg:items-stretch">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <FadeIn direction="up">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f6e0ce]/60 border border-border-warm text-ink text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{contentData.hero.availablePill}</span>
              </div>
            </FadeIn>

            {/* Headline */}
            <FadeIn direction="up" delay={50}>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-serif text-primary font-bold text-xs sm:text-sm tracking-widest uppercase">
                    {contentData.hero.craftLabel}
                  </span>
                  <div className="h-px w-12 bg-primary/30" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-[1.14] tracking-tight">
                  Crafting Scalable Systems with{" "}
                  <span className="text-primary italic">{contentData.hero.headlineAccent}</span>{" "}
                  Precision.
                </h1>
              </div>
            </FadeIn>

            {/* Sub-headline */}
            <FadeIn direction="up" delay={100}>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-2xl">
                {contentData.hero.subheadline}
              </p>
            </FadeIn>

            {/* Professional Value Badges Row */}
            <FadeIn direction="up" delay={150}>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {contentData.hero.badges.map((badgeText) => (
                  <Badge key={badgeText} variant="tech">{badgeText}</Badge>
                ))}
              </div>
            </FadeIn>

            {/* Call to Action Buttons */}
            <FadeIn direction="up" delay={200}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/projects">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {contentData.hero.ctaExploreWork}
                  </Button>
                </Link>
                {resumeUrl ? (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="secondary"
                      size="md"
                      icon={<FileText className="w-4 h-4 text-primary" />}
                    >
                      {contentData.hero.ctaResume}
                    </Button>
                  </a>
                ) : (
                  <Link
                    href="/#contact"
                    onClick={(e) => {
                      const el = document.getElementById("contact");
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      icon={<FileText className="w-4 h-4 text-primary" />}
                    >
                      {contentData.hero.ctaResume}
                    </Button>
                  </Link>
                )}
              </div>
            </FadeIn>

            {/* Key Metrics Strip (Flex Justify-Between for Equal Visual Spacing) */}
            <FadeIn direction="up" delay={250}>
              <div className="pt-5 border-t border-border-subtle w-full max-w-md sm:max-w-[460px]">
                <div className="flex items-start justify-between gap-3 sm:gap-6">
                  <div className="shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold font-serif text-ink">
                      <CounterNumber
                        to={experienceYears}
                        suffix="+"
                        delay={0.15}
                        duration={0.65}
                      />
                    </div>
                    <div className="text-xs text-ink-muted font-mono mt-0.5 whitespace-nowrap">
                      {contentData.hero.statsYearsExp}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold font-serif text-primary">
                      <CounterNumber
                        to={totalProjects}
                        suffix="+"
                        delay={0.2}
                        duration={0.75}
                      />
                    </div>
                    <div className="text-xs text-ink-muted font-mono mt-0.5 whitespace-nowrap">
                      {contentData.hero.statsProjects}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold font-serif text-ink">
                      <CounterNumber
                        to={totalBlogs}
                        suffix="+"
                        delay={0.25}
                        duration={0.85}
                      />
                    </div>
                    <div className="text-xs text-ink-muted font-mono mt-0.5 whitespace-nowrap">
                      {contentData.hero.statsArticles}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Visual Card Component (Desktop Only - Unmounted on Mobile/Tablet for Performance Optimization) */}
          <FadeIn direction="up" delay={150} className="hidden md:block lg:col-span-5 relative pt-4 md:pt-6 lg:self-end lg:pb-4">
            <DesktopArchitectureCard name={name} role={role} status={status} />
          </FadeIn>
        </div>
      </Container>

      {/* --- JAPANESE SEIGAIHA (青海波) REUSABLE ANIMATED UI COMPONENT --- */}
      <SeigaihaPattern />
    </section>
  );
};
