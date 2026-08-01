import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";
import { SidebarProvider } from "@/components/admin/SidebarContext";
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

  const cookieStore = await cookies();
  const savedSidebar = cookieStore.get("sidebar")?.value;
  const initialSidebarState = savedSidebar === "close" ? "close" : "open";

  return (
    <SessionProviderWrapper>
      <SidebarProvider initialState={initialSidebarState}>
        <div className="admin-portal min-h-screen lg:h-screen w-full lg:overflow-hidden bg-paper text-ink flex flex-col lg:flex-row">
          {session && <AdminSidebar user={session.user} />}
          <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto bg-paper flex flex-col transition-all duration-300 ease-in-out pt-[63px] lg:pt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </SessionProviderWrapper>
  );
}
