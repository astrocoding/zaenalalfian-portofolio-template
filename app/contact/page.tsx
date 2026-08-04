import * as React from "react";
import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { ContactSection } from "@/components/sections/ContactSection";
import { prisma } from "@/lib/prisma";
import { buildCanonical, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact & Reach Out | Zaenal Alfian",
  description:
    "Open for senior engineering leadership, frontend architecture consulting, and high-impact web product development. Get in touch with Zaenal Alfian.",
  keywords: [
    "Contact Zaenal Alfian",
    "Hire Full-Stack Engineer",
    "Frontend Architect Consulting",
    "Software Engineer Contact",
    "Zaenal Alfian",
  ],
  alternates: {
    canonical: buildCanonical("/contact"),
  },
  openGraph: {
    type: "website",
    url: buildCanonical("/contact"),
    title: "Contact & Reach Out | Zaenal Alfian",
    description:
      "Open for senior engineering leadership, frontend architecture consulting, and high-impact web product development.",
    images: [
      {
        url: DEFAULT_OG_IMAGE(),
        width: 1200,
        height: 630,
        alt: "Contact Zaenal Alfian",
      },
    ],
    siteName: "Zaenal Alfian Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Reach Out | Zaenal Alfian",
    description:
      "Open for senior engineering leadership, frontend architecture consulting, and high-impact web product development.",
    images: [DEFAULT_OG_IMAGE()],
    creator: "@zaenalalfian",
  },
};

export default async function ContactPage() {
  let dbAdminUser:
    | (Awaited<ReturnType<typeof prisma.user.findFirst>> & {
        contact?: Awaited<ReturnType<typeof prisma.contact.findFirst>> | null;
      })
    | null = null;

  try {
    dbAdminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      include: { contact: true },
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error("Error fetching ContactPage admin data:", err);
  }

  return (
    <MainLayout>
      <ContactSection
        isStandalonePage
        contactData={
          dbAdminUser
            ? {
                name: dbAdminUser.name,
                position: dbAdminUser.position,
                gmail: dbAdminUser.contact?.gmail,
                location: dbAdminUser.location,
                availability: dbAdminUser.availability,
              }
            : undefined
        }
      />
    </MainLayout>
  );
}
