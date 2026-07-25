import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { DocForm } from "@/components/admin/DocForm";

export default async function NewDocPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/docs"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Documentation Management</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Create New Documentation Guide / 新規文書作成
        </h1>
      </div>

      <DocForm />
    </div>
  );
}
