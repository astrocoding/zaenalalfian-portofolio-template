import * as React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/BlogForm";

export const metadata = {
  title: "Edit Article | Admin Portal",
};

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
    <div className="w-full pb-12">
      <BlogForm initialData={blog} isEdit />
    </div>
  );
}
