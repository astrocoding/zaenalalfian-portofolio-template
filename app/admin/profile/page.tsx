import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileAndAboutAction } from "@/app/actions/admin";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { AboutCardManager } from "@/components/admin/AboutCardManager";

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
    <div className="w-full pb-12">
      {/* Main Profile & About Content Form (includes AdminFormHeader with Save All action) */}
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
        <div className="px-4 sm:px-6 lg:px-6 pt-6">
          <AboutCardManager
            aboutId={about.id}
            initialCards={about.cards || []}
          />
        </div>
      )}
    </div>
  );
}
