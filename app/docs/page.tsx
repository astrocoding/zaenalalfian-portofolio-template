import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CardCornerSeigaiha } from "@/components/ui/CardCornerSeigaiha";
import { getAllDocs } from "@/lib/docs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRight, FileText } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Documentation & Technical Guides | Zaenal Alfian",
  description:
    "Comprehensive technical documentation, architecture blueprints, design system notes, and engineering guides.",
};

export default async function DocsPage() {
  const docs = await getAllDocs();

  return (
    <MainLayout>
      <div className="bg-paper min-h-screen">
        <SectionWrapper
          id="public-docs"
          kanjiSubtitle="公式文書"
          sectionTitle="Technical Documentation"
          sectionDescription="Comprehensive technical blueprints, system architecture notes, and developer guides."
          bgVariant="paper"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {docs.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={FileText}
                  title="No docs posted yet"
                  subtitleKanji="ドキュメントはまだありません"
                  description="Technical blueprints, system architecture notes, and developer guides will be published here."
                />
              </div>
            ) : (
              docs.map((doc) => (
                <Card key={doc.frontmatter.slug} hoverEffect className="relative overflow-hidden p-6 flex flex-col justify-between">
                  <CardCornerSeigaiha cardBgColor="#ffffff" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent" size="sm">
                        {doc.frontmatter.category}
                      </Badge>
                      <span className="font-serif text-xs text-primary/50 font-semibold">文書</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-ink leading-snug line-clamp-2">
                        {doc.frontmatter.title}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                        {doc.frontmatter.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 mt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-muted flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Guide
                    </span>
                    <Link
                      href={`/docs/${doc.frontmatter.category.toLowerCase()}/${doc.frontmatter.slug}`}
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Read Doc <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </SectionWrapper>
      </div>
    </MainLayout>
  );
}
