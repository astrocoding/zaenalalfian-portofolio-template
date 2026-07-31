import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!blog) notFound();

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
          Edit Article: {blog.title}
        </h1>
      </div>

      <BlogForm initialData={blog} isEdit />
    </div>
  );
}
