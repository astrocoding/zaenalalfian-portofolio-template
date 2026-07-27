import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileAndAboutAction } from "@/app/actions/admin";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { AboutCardManager } from "@/components/admin/AboutCardManager";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Profile & About Management | Admin Portal",
};

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/admin/login");
  }

  const result = await getProfileAndAboutAction(session.user.id);

  if (!result.success || !result.user) {
    return (
      <div className="p-8 text-center text-rose-600 font-mono text-sm">
        Failed to load profile data: {result.error || "User record not found."}
      </div>
    );
  }

  const { user, about, contact } = result;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-border-warm space-y-2">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink tracking-tight">
              Admin Profile &amp; About Section / プロフィール設定
            </h1>
          </div>
        </div>
      </div>

      {/* Main Profile & About Content Form */}
      <ProfileForm
        userId={user.id}
        initialUser={{
          name: user.name,
          username: user.username,
          email: user.email,
          position: user.position,
          activity: user.activity,
          experience: user.experience,
          location: user.location,
          availability: user.availability,
          quotes: user.quotes,
          bio: user.bio,
          resume: user.resume,
        }}
        initialAbout={
          about
            ? {
                id: about.id,
                title: about.title,
                subtitle: about.subtitle,
                excerpt: about.excerpt,
                description: about.description,
              }
            : null
        }
        initialContact={
          contact
            ? {
                gmail: contact.gmail,
                whatsapp: contact.whatsapp,
                github: contact.github,
                linkedin: contact.linkedin,
                instagram: contact.instagram,
                facebook: contact.facebook,
              }
            : null
        }
      />

      {/* About Cards & Engineering Principles Manager */}
      {about && (
        <AboutCardManager
          aboutId={about.id}
          initialCards={about.cards || []}
        />
      )}
    </div>
  );
}
