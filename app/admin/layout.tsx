import * as React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.warn("NextAuth session decryption warning (handled gracefully):", error);
  }

  return (
    <SessionProviderWrapper>
      <div className="min-h-screen bg-paper text-ink flex flex-col lg:flex-row">
        {session && <AdminSidebar user={session.user} />}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10">{children}</main>
      </div>
    </SessionProviderWrapper>
  );
}
