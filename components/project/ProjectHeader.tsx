import * as React from "react";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ExternalLink, Code2, ArrowLeft, Calendar } from "lucide-react";

export interface ProjectHeaderProps {
  title: string;
  category: string;
  description: string;
  techstack: string[];
  repository?: string | null;
  sourceLink?: string | null;
  createdAt?: Date | string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  category,
  description,
  techstack,
  repository,
  sourceLink,
  createdAt,
}) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="space-y-6 pb-8 border-b border-border-warm">
      {/* Back Navigation Link */}
      <Link
        href="/#projects"
        className="inline-flex items-center space-x-2 text-xs font-mono text-ink-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects / 実績一覧へ戻る</span>
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" size="md">
            {category}
          </Badge>
          <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="font-serif text-xs text-primary/50 font-semibold">プロジェクト詳細</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-lg text-ink-muted leading-relaxed font-sans max-w-3xl">
          {description}
        </p>
      </div>

      {/* Techstack pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {techstack.map((tech) => (
          <Badge key={tech} variant="tech" size="md">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Action Links */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {sourceLink && (
          <a href={sourceLink} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="md" icon={<ExternalLink className="w-4 h-4" />}>
              Live Production App
            </Button>
          </a>
        )}

        {repository && (
          <a href={repository} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="md" icon={<Code2 className="w-4 h-4" />}>
              View Repository
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};
