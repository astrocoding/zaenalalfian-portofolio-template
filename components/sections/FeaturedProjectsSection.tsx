"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Button } from "../ui/Button";
import { CardCornerSeigaiha } from "../ui/CardCornerSeigaiha";
import { ArrowRight, FolderGit2 } from "lucide-react";

import Image from "next/image";
import { EmptyState } from "../ui/EmptyState";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  techstack: string[];
}

const ProjectCardThumbnail: React.FC<{ thumbnail: string; title: string; category: string }> = ({
  thumbnail,
  title,
  category,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const isCustomImage =
    thumbnail &&
    thumbnail !== "/projects/preview.jpg" &&
    (thumbnail.startsWith("/upload/") || thumbnail.startsWith("http") || thumbnail.includes(".")) &&
    !imageError;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isCustomImage ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          decoding="async"
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#f6e0ce]/30">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-medium text-ink-muted">
            {category}
          </span>
        </div>
      )}
    </div>
  );
};

export const BoxyProjectCard: React.FC<{
  project: ProjectItem;
  index: number;
  className?: string;
}> = ({ project, index, className = "" }) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六"];
  const kanjiNum = kanjiNumbers[index % kanjiNumbers.length] || "一";

  // Limit techstack badges on image to max 3 items, showing "+N more" badge if overflow
  const maxVisibleTech = 3;
  const visibleTech = project.techstack.slice(0, maxVisibleTech);
  const remainingTechCount = project.techstack.length - maxVisibleTech;

  return (
    <div
      className={`group relative bg-surface border border-border-subtle hover:border-primary hover:-translate-y-1.5 rounded-2xl transition-all duration-300 flex flex-col overflow-hidden w-full ${className}`}
    >
      {/* Bottom-right Japanese Seigaiha wave accent - matching white card background */}
      <CardCornerSeigaiha cardBgColor="#ffffff" />

      {/* --- TOP THUMBNAIL IMAGE WITH TECH BADGES OVERLAY --- */}
      <Link href={`/projects/${project.slug}`} className="block relative z-10 w-full h-40 sm:h-44 overflow-hidden bg-[#f6e0ce]/30 shrink-0 rounded-t-2xl">
        <ProjectCardThumbnail
          thumbnail={project.thumbnail}
          title={project.title}
          category={project.category}
        />

        {/* Kanji Number Badge Top-Right */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-amber-200 font-serif text-xs font-bold border border-amber-200/30 shadow-xs">
            其の{kanjiNum}
          </span>
        </div>

        {/* Tech Badges Overlaid at Bottom-Left of Image (Single Row Max, "+N more" fallback) */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-hidden pointer-events-none">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="inline-block px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-ink text-[11px] font-mono font-medium border border-border-subtle shadow-xs truncate max-w-[100px]"
            >
              {tech}
            </span>
          ))}
          {remainingTechCount > 0 && (
            <span className="inline-block px-2 py-1 rounded-md bg-primary/90 backdrop-blur-md text-white text-[11px] font-mono font-semibold shadow-xs shrink-0">
              +{remainingTechCount} more
            </span>
          )}
        </div>
      </Link>

      {/* --- CARD CONTENT BODY --- */}
      <div className="relative z-10 p-4 sm:p-4.5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider truncate mr-2">
              {project.category}
            </span>
            <span className="font-serif text-xs font-bold text-primary shrink-0">実績作品</span>
          </div>

          {/* Title (Truncated to 1 line with ellipsis if exceeds) */}
          <Link href={`/projects/${project.slug}`} className="group/title block">
            <h3 className="text-base font-serif font-bold text-ink group-hover/title:text-primary transition-colors leading-snug truncate" title={project.title}>
              {project.title}
            </h3>
          </Link>

          {/* Description (Truncated to exactly 2 lines) */}
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* --- VIEW PROJECT BUTTON (Boxy, No Border, Font-Mono, Diagonal Stripes & Amber Colors) --- */}
        <Link href={`/projects/${project.slug}`} className="block w-full pt-1">
          <div className="relative w-full py-2.5 px-3.5 rounded-md bg-gradient-to-r from-[#993b3d] via-[#b04749] to-[#993b3d] shadow-2xs hover:shadow-md flex items-center justify-center space-x-2 text-amber-200 group-hover:brightness-105 transition-all duration-300 overflow-hidden">
            {/* Subtle Diagonal Stripe Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:12px_12px] opacity-40 pointer-events-none" />

            <span className="font-mono text-xs font-semibold uppercase tracking-wider relative z-10 text-amber-200">
              View Project
            </span>
            <ArrowRight className="w-3.5 h-3.5 relative z-10 text-amber-200 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export const FeaturedProjectsSection: React.FC<{ projects?: ProjectItem[] }> = ({
  projects = [],
}) => {
  const hasProjects = projects && projects.length > 0;

  return (
    <SectionWrapper
      id="projects"
      kanjiSubtitle="主要実績"
      sectionTitle="Featured Projects"
      sectionDescription="Production web applications, architectural platforms, and technical open-source contributions."
      headerAlign="center"
      bgVariant="paper"
      containerSize="wide"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24"
    >
      {!hasProjects ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects posted yet"
          subtitleKanji="実績作品はまだありません"
          description="Production web applications, architecture platforms, and technical contributions will be showcased here once published."
        />
      ) : (
        <>
          <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none gap-4 sm:gap-5 pb-6 pt-2 items-stretch">
            {projects.map((project, index) => (
              <BoxyProjectCard
                key={project.id}
                project={project}
                index={index}
                className="w-[85vw] sm:w-[calc(50%-10px)] lg:w-auto shrink-0 snap-start lg:shrink"
              />
            ))}
          </div>

          <div className="mt-12 sm:mt-16 flex items-center justify-center w-full">
            <div className="flex-1 h-px bg-border-subtle" />
            <Link href="/projects" className="mx-4 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl px-5 py-2.5 text-xs font-mono font-semibold border-border-warm bg-surface hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Show More Projects
              </Button>
            </Link>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};
