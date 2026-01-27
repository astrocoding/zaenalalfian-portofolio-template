"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-12 overflow-hidden bg-paper min-h-[calc(100vh-80px)] flex items-center">
      {/* Decorative Subtle Japanese Grid & Background Motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(#b04749_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Floating Vertical Kanji Accent (Right Side) */}
      <div className="hidden lg:block absolute top-16 right-12 font-serif text-primary/10 text-8xl font-bold tracking-widest pointer-events-none select-none writing-mode-vertical">
        創造と建築
      </div>

      <Container size="wide" className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Main Hero Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-4 sm:space-y-5"
          >
            {/* Status Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f6e0ce]/60 border border-border-warm text-ink text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="font-serif text-primary font-bold text-xs sm:text-sm tracking-widest uppercase">
                  職人精神 • Craftsmanship
                </span>
                <div className="h-px w-12 bg-primary/30" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-[1.14] tracking-tight">
                Crafting Scalable Systems with <span className="text-primary italic">Minimalist</span> Precision.
              </h1>
            </div>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-2xl">
              Hi, I'm <strong className="text-ink font-semibold">Zaenal Alfian</strong>. A Senior Full-Stack Engineer & Frontend Architect specializing in Next.js 16, React 19, TypeScript, and high-performance Web Applications.
            </p>

            {/* Tech Badges Row */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              <Badge variant="tech">Next.js 16</Badge>
              <Badge variant="tech">React 19</Badge>
              <Badge variant="tech">TypeScript</Badge>
              <Badge variant="tech">TailwindCSS v4</Badge>
              <Badge variant="tech">Prisma ORM</Badge>
              <Badge variant="tech">PostgreSQL</Badge>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/#projects">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Explore Work
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="secondary" size="md" icon={<Sparkles className="w-4 h-4 text-primary" />}>
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Key Metrics Strip (Visible in single screen fold) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-border-subtle max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-ink">6+</div>
                <div className="text-xs text-ink-muted font-mono mt-0.5">Years Exp.</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-primary">30+</div>
                <div className="text-xs text-ink-muted font-mono mt-0.5">Projects Built</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-ink">99.9%</div>
                <div className="text-xs text-ink-muted font-mono mt-0.5">Code Quality</div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Card Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Japanese Minimalist Frame Container */}
            <div className="relative mx-auto max-w-md bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 shadow-card overflow-hidden">
              {/* Top Red Japanese Hanko Stamp Motif */}
              <div className="absolute top-4 right-4 w-9 h-9 border-2 border-primary/40 rounded flex items-center justify-center text-primary font-serif font-bold text-xs select-none opacity-80 rotate-12">
                印
              </div>

              {/* Code Snippet Box Header */}
              <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-border-subtle">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-ink-muted ml-2">architecture.ts</span>
              </div>

              {/* Mock Code Block */}
              <div className="space-y-1.5 font-mono text-xs text-ink leading-relaxed">
                <p className="text-primary font-semibold">// Personal Philosophy</p>
                <p>
                  <span className="text-purple-600">const</span> developer = &#123;
                </p>
                <p className="pl-4">
                  name: <span className="text-emerald-700">"Zaenal Alfian"</span>,
                </p>
                <p className="pl-4">
                  role: <span className="text-emerald-700">"Senior Full-Stack Architect"</span>,
                </p>
                <p className="pl-4">
                  values: [<span className="text-emerald-700">"Clean Code"</span>, <span className="text-emerald-700">"Performance"</span>, <span className="text-emerald-700">"UX Excellence"</span>],
                </p>
                <p className="pl-4">
                  status: <span className="text-amber-700">"Building Great Products"</span>
                </p>
                <p>&#125;;</p>
              </div>

              {/* Japanese Aesthetic Card Footer */}
              <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Production Ready</span>
                </div>
                <span className="font-serif text-primary/60 italic text-xs">美と技術の融合</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
