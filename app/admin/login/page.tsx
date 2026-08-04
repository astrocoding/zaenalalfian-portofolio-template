import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

/**
 * /admin/login — Server Component guard.
 *
 * Session is verified on the server before ANY HTML is streamed to the browser.
 * If a valid admin session already exists, Next.js issues a 307 redirect to
 * /admin before the login page is ever rendered — zero flash, zero delay.
 */
export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // Active session detected → hard redirect to admin dashboard immediately
  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  // No session — render the interactive login form (client component)
  return <LoginForm />;
}
