import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BlogForm } from "@/components/admin/BlogForm";

export const metadata = {
  title: "New Article | Admin Portal",
};

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="w-full pb-12">
      <BlogForm />
    </div>
  );
}
