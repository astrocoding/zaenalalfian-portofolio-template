"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, FolderGit2 } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  techstack: string[];
}

const fallbackProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Zenith Architecture Platform",
    slug: "zenith-architecture-platform",
    category: "Full-Stack Web App",
    description:
      "Enterprise Next.js 16 app with Server Components, PostgreSQL, and Prisma ORM for high-throughput cloud infrastructure management.",
    thumbnail: "/projects/zenith.jpg",
    techstack: ["Next.js 16", "React 19", "PostgreSQL", "Prisma 7", "TailwindCSS"],
  },
  {
    id: "proj-2",
    title: "Kaizen Design System",
    slug: "kaizen-design-system",
    category: "Design System & UI Library",
    description:
      "Japanese minimalist editorial design system for scalable web applications featuring soft warm palettes and accessible micro-interactions.",
    thumbnail: "/projects/kaizen.jpg",
    techstack: ["React 19", "TypeScript", "TailwindCSS v4", "Framer Motion", "Storybook"],
  },
  {
    id: "proj-3",
    title: "Shuri Docs & Knowledge Engine",
    slug: "shuri-docs-engine",
    category: "Documentation Platform",
    description:
      "High-speed MDX-powered documentation platform with dynamic TOC, instant search, and code highlight optimizations.",
    thumbnail: "/projects/shuri.jpg",
    techstack: ["Next.js 16", "MDX", "gray-matter", "TailwindCSS v4", "TypeScript"],
  },
];

const ProjectCardThumbnail: React.FC<{ thumbnail: string; title: string; category: string; slug: string }> = ({
  thumbnail,
  title,
  category,
  slug,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const isCustomImage =
    thumbnail &&
    thumbnail !== "/projects/preview.jpg" &&
    (thumbnail.startsWith("/upload/") || thumbnail.startsWith("http") || thumbnail.includes(".")) &&
    !imageError;

  return (
    <Link href={`/projects/${slug}`} className="block relative w-full h-full group/img overflow-hidden rounded-lg">
      <div className="h-full w-full bg-[#f6e0ce]/30 border border-border-subtle rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
        {isCustomImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnail}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-medium text-ink-muted">
              {category}
            </span>
          </div>
        )}

        {/* --- HOVER EXPLORE OVERLAY ON IMAGE --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center p-4 z-20 backdrop-blur-[2px]">
          <span className="inline-flex items-center space-x-2 bg-primary text-white text-xs font-mono font-semibold px-4 py-2.5 rounded-xl shadow-xl transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300 border border-amber-200/30">
            <span>Explore Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const JapaneseScrollProjectCard: React.FC<{
  project: ProjectItem;
  index: number;
  className?: string;
}> = ({ project, index, className = "" }) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六"];
  const kanjiNum = kanjiNumbers[index % kanjiNumbers.length] || "一";

  return (
    <div className={`group relative flex flex-col items-center w-full h-auto transition-all duration-300 px-2 sm:px-3 ${className}`}>
      {/* --- TOP WOODEN SCROLL ROLLER BAR (JIKUGI HEADER) --- */}
      <div className="relative z-30 w-full flex items-center">
        {/* Left Dark Wood Knob (Vertically centered) */}
        <div className="absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-9 sm:h-[38px] bg-[#1c1917] rounded-l-md border-r-2 border-[#3c3633] shadow-md flex items-center justify-center z-40">
          <div className="w-1 h-5 bg-[#3c3633] rounded-sm" />
        </div>

        {/* Center Vermilion Red Banner */}
        <div className="w-full h-8 bg-gradient-to-r from-[#993b3d] via-[#b04749] to-[#993b3d] px-3.5 sm:px-4 flex items-center justify-between shadow-md relative overflow-hidden border-t border-x border-[#7e2d2f] rounded-none">
          {/* Subtle Japanese Stripe Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:12px_12px] opacity-40 pointer-events-none" />

          <span className="font-serif text-xs font-bold text-white tracking-wider relative z-10 truncate">
            {project.category}
          </span>
          <span className="font-serif text-xs font-extrabold text-amber-200/90 relative z-10 shrink-0 ml-2">
            其の{kanjiNum}
          </span>
        </div>

        {/* Right Dark Wood Knob (Vertically centered) */}
        <div className="absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-9 sm:h-[38px] bg-[#1c1917] rounded-r-md border-l-2 border-[#3c3633] shadow-md flex items-center justify-center z-40">
          <div className="w-1 h-5 bg-[#3c3633] rounded-sm" />
        </div>
      </div>

      {/* --- JAPANESE SCROLL PARCHMENT PAPER BODY (UNROLLS DOWNWARD ON HOVER) --- */}
      <div className="relative w-[calc(100%-0.75rem)] sm:w-[calc(100%-1rem)] bg-surface border-x-2 border-[#ebd9c8] shadow-card flex flex-col pt-3 pb-1 sm:pb-1.5 px-4 sm:px-5 z-10 transition-all duration-500 ease-out group-hover:shadow-2xl overflow-hidden">
        {/* Subtle Traditional Paper Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#b04749_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

        {/* --- HERO THUMBNAIL ARTWORK WITH HOVER OVERLAY --- */}
        <div className="relative w-full h-40 sm:h-44 my-0.5 shrink-0">
          <ProjectCardThumbnail
            thumbnail={project.thumbnail}
            title={project.title}
            category={project.category}
            slug={project.slug}
          />
        </div>

        {/* --- ALWAYS VISIBLE HEADER DETAILS --- */}
        <div className="mt-2">
          <div className="flex items-center justify-between border-b border-border-subtle pb-1 mb-1.5">
            <span className="text-[11px] font-mono font-semibold text-primary uppercase tracking-wider">
              {project.category}
            </span>
            <span className="font-serif text-xs font-bold text-primary/60">実績作品</span>
          </div>

          <Link href={`/projects/${project.slug}`} className="group/title block">
            <h3 className="text-base sm:text-lg font-serif font-bold text-ink group-hover/title:text-primary transition-colors leading-snug">
              {project.title}
            </h3>
          </Link>
        </div>

        {/* --- UNROLLING SCROLL EXTENSION CONTENT (Expands Top to Bottom on Hover) --- */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-in-out overflow-hidden">
          <div className="min-h-0 overflow-hidden space-y-3 pt-2 pb-3 px-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techstack.map((tech) => (
                <Badge key={tech} variant="tech" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM WOODEN SCROLL ROLLER BAR (JIKUGI FOOTER WITH COLOR UNROLL ANIMATION) --- */}
      <div className="relative z-30 w-full flex items-center">
        {/* Left Bottom Dark Wood Knob (Static constant cap) */}
        <div className="absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-9 sm:h-[38px] bg-[#1c1917] rounded-l-md border-r-2 border-[#3c3633] shadow-md flex items-center justify-center z-40">
          <div className="w-1 h-5 bg-[#3c3633] rounded-sm" />
        </div>

        {/* Center Bottom Roller Bar (Unrolls from Red to Dark Wood on hover) */}
        <div className="w-full h-8 shadow-md relative overflow-hidden border-b border-x rounded-none transition-colors duration-700 ease-in-out border-[#7e2d2f] group-hover:border-[#1c1917]">
          {/* Bare Dark Wood Roller Core (Revealed when red paper unrolls off) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#2d2724] to-[#1c1917] flex items-center justify-center">
            <div className="w-full h-1 bg-[#3c3633]/60 shadow-inner" />
          </div>

          {/* Red Vermilion Paper Layer (Static state: covers bar; Hover state: unwinds & fades to reveal dark wood) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#993b3d] via-[#b04749] to-[#993b3d] px-3.5 sm:px-4 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-all duration-700 ease-in-out">
            {/* Subtle Japanese Stripe Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:12px_12px] opacity-40 pointer-events-none group-hover:translate-y-full transition-transform duration-700 ease-in-out" />
            <div className="w-full h-0.5 bg-amber-200/40 relative z-10 shadow-inner rounded-full" />
          </div>
        </div>

        {/* Right Bottom Dark Wood Knob (Static constant cap) */}
        <div className="absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-9 sm:h-[38px] bg-[#1c1917] rounded-r-md border-l-2 border-[#3c3633] shadow-md flex items-center justify-center z-40">
          <div className="w-1 h-5 bg-[#3c3633] rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export const FeaturedProjectsSection: React.FC<{ projects?: ProjectItem[] }> = ({
  projects = fallbackProjects,
}) => {
  return (
    <SectionWrapper
      id="projects"
      kanjiSubtitle="主要実績"
      sectionTitle="Featured Projects"
      sectionDescription="Production web applications, architectural platforms, and technical open-source contributions."
      headerAlign="center"
      bgVariant="paper"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start">
        {projects.map((project, index) => (
          <JapaneseScrollProjectCard
            key={project.id}
            project={project}
            index={index}
            className={index >= 2 ? "hidden lg:flex" : undefined}
          />
        ))}
      </div>

      {/* --- SECTION SEPARATOR WITH CENTERED SHOW MORE PROJECTS BUTTON --- */}
      <div className="mt-12 sm:mt-16 flex items-center justify-center w-full">
        <div className="flex-1 h-px bg-border-subtle" />
        <Link href="/projects" className="mx-4 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-5 py-2.5 text-xs font-mono font-semibold border-border-warm bg-surface hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Show More Projects
          </Button>
        </Link>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    </SectionWrapper>
  );
};
