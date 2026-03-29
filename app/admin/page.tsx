import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FolderGit2,
  BookOpen,
  FileCode,
  Users,
  Briefcase,
  Plus,
  ArrowRight,
  Database,
  ShieldCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  let projectCount = 0;
  let blogCount = 0;
  let docCount = 0;
  let experienceCount = 0;
  let userCount = 0;

  try {
    projectCount = await prisma.project.count();
    blogCount = await prisma.blog.count();
    docCount = await prisma.doc.count();
    experienceCount = await prisma.experience.count();
    userCount = await prisma.user.count();
  } catch (e) {
    console.warn("Database query error on admin dashboard:", e);
  }

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
      title: "Admin Users",
      count: userCount,
      kanji: "ユーザー",
      href: "/admin/users",
      newHref: "/admin/users/new",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated Session as {session.user?.email}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink tracking-tight mt-1">
            Dashboard Overview / 概要
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projects/new">
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              New Project
            </Button>
          </Link>
          <Link href="/admin/experiences/new">
            <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              New Experience
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
  );
}
