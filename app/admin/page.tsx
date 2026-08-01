import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import {
  FolderGit2,
  BookOpen,
  FileCode,
  Users,
  Briefcase,
  GraduationCap,
  Plus,
  ArrowRight,
  Database,
} from "lucide-react";

import { AdminFormHeader } from "@/components/admin/AdminFormHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [
    projectRes,
    blogRes,
    docRes,
    experienceRes,
    educationRes,
    skillsetRes,
    userRes,
  ] = await Promise.allSettled([
    prisma.project.count(),
    prisma.blog.count(),
    prisma.doc.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.skillset.count(),
    prisma.user.count(),
  ]);

  const projectCount = projectRes.status === "fulfilled" ? projectRes.value : 0;
  const blogCount = blogRes.status === "fulfilled" ? blogRes.value : 0;
  const docCount = docRes.status === "fulfilled" ? docRes.value : 0;
  const experienceCount = experienceRes.status === "fulfilled" ? experienceRes.value : 0;
  const educationCount = educationRes.status === "fulfilled" ? educationRes.value : 0;
  const skillsetCount = skillsetRes.status === "fulfilled" ? skillsetRes.value : 0;
  const userCount = userRes.status === "fulfilled" ? userRes.value : 0;

  const metrics = [
    {
      title: "Showcase Projects",
      count: projectCount,
      kanji: "実績",
      href: "/admin/projects",
      newHref: "/admin/projects/new",
      icon: FolderGit2,
    },
    {
      title: "Blog Articles",
      count: blogCount,
      kanji: "記事",
      href: "/admin/blogs",
      newHref: "/admin/blogs/new",
      icon: BookOpen,
    },
    {
      title: "Documentation Guides",
      count: docCount,
      kanji: "文書",
      href: "/admin/docs",
      newHref: "/admin/docs/new",
      icon: FileCode,
    },
    {
      title: "Professional Journey",
      count: experienceCount,
      kanji: "経歴",
      href: "/admin/experiences",
      newHref: "/admin/experiences/new",
      icon: Briefcase,
    },
    {
      title: "Academic Education",
      count: educationCount,
      kanji: "学歴",
      href: "/admin/education",
      newHref: "/admin/education/new",
      icon: GraduationCap,
    },
    {
      title: "Technical Skillsets",
      count: skillsetCount,
      kanji: "技能",
      href: "/admin/skillsets",
      newHref: "/admin/skillsets/new",
      icon: Database,
    },
    {
      title: "Admin Users",
      count: userCount,
      kanji: "ユーザー",
      href: "/admin/users",
      newHref: "/admin/users/new",
      icon: Users,
    },
  ];

  return (
    <div className="w-full pb-12">
      <AdminFormHeader
        backHref="/admin"
        backLabel="Dashboard Overview"
        title="Dashboard Overview"
        showSearch={false}
        showBadge={false}
        showSaveDraft={false}
        primaryActionLabel="New Project"
        primaryActionHref="/admin/projects/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 space-y-6 w-full">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} hoverEffect className="bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-serif text-xs font-semibold text-primary/50">
                    {item.kanji}
                  </span>
                </div>

                <div className="mt-3 space-y-0.5">
                  <h3 className="text-2xl font-serif font-bold text-ink">{item.count}</h3>
                  <p className="text-[11px] font-mono text-ink-muted truncate">{item.title}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={item.newHref}
                    className="text-[10px] font-mono text-ink-muted hover:text-ink inline-flex items-center gap-1"
                  >
                    + Add
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* System Quick Information */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-border-subtle">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-lg text-ink">Database &amp; System Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded bg-paper border border-border-subtle space-y-1">
              <span className="text-ink-muted block">Database Engine</span>
              <span className="font-bold text-ink">PostgreSQL (portfolio_db)</span>
            </div>

            <div className="p-3 rounded bg-paper border border-border-subtle space-y-1">
              <span className="text-ink-muted block">ORM Provider</span>
              <span className="font-bold text-ink">Prisma 7 (@prisma/adapter-pg)</span>
            </div>

            <div className="p-3 rounded bg-paper border border-border-subtle space-y-1">
              <span className="text-ink-muted block">Authentication</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> NextAuth Credentials
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
