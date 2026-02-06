"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
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
    <div className="h-48 w-full bg-[#f6e0ce]/40 border-b border-border-subtle rounded-t-lg flex flex-col items-center justify-center relative overflow-hidden group">
      {isCustomImage ? (
        <img
          src={thumbnail}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent-mauve/20 opacity-60" />
          <FolderGit2 className="w-12 h-12 text-primary/60 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <span className="text-xs font-mono text-ink-muted mt-2 relative z-10">
            {category}
          </span>
        </>
      )}
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
      sectionTitle="Featured Engineering Projects"
      sectionDescription="Production web applications, architectural platforms, and technical open-source contributions."
      bgVariant="paper"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} hoverEffect className="flex flex-col h-full bg-surface">
            {/* Visual Header / Thumbnail Box with Graceful Image Error Handling */}
            <ProjectCardThumbnail
              thumbnail={project.thumbnail}
              title={project.title}
              category={project.category}
            />

            {/* Card Content */}
            <CardHeader className="pt-5 pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">
                  {project.category}
                </Badge>
                <span className="font-serif text-xs text-primary/50 font-semibold">実績作品</span>
              </div>
              <CardTitle className="text-xl font-bold font-serif text-ink mt-2">
                {project.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <CardDescription className="text-sm leading-relaxed text-ink-muted">
                {project.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.techstack.map((tech) => (
                  <Badge key={tech} variant="tech" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-border-subtle">
              <Link href={`/projects/${project.slug}`} className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Case Study
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
