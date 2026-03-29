import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2, ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { deleteProjectAction } from "@/app/actions/admin";

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("Error fetching projects:", e);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-ink">
            Project Showcase Management / 実績管理
          </h1>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Create Project / 新規追加
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4">Links</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No projects found in database. Click &quot;Create Project&quot; to add one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-ink block font-serif">{proj.title}</span>
                      <span className="text-xs font-mono text-ink-muted">/{proj.slug}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="accent" size="sm">
                        {proj.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.techstack.slice(0, 3).map((t: string) => (
                          <Badge key={t} variant="tech" size="sm">
                            {t}
                          </Badge>
                        ))}
                        {proj.techstack.length > 3 && (
                          <span className="text-[10px] text-ink-muted font-mono">
                            +{proj.techstack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        {proj.sourceLink && (
                          <a
                            href={proj.sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Live
                          </a>
                        )}
                        {proj.repository && (
                          <a
                            href={proj.repository}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ink-muted hover:underline flex items-center gap-1"
                          >
                            <Code2 className="w-3 h-3" /> Repo
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/projects/${proj.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <form
                          action={async () => {
                            "use server";
                            await deleteProjectAction(proj.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
