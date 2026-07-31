import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="p-4 sm:p-6 lg:p-6 space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles Management</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Create New Article / 新規記事作成
        </h1>
      </div>

      <BlogForm />
    </div>
  );
}
