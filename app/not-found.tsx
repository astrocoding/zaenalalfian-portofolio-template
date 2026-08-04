import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Mail } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import contentData from "@/data/content.json";
import mockupData from "@/data/mockup.json";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Zaenal Alfian",
  description: "The requested page or resource could not be found.",
};

export default async function NotFound() {
  let supportEmail = mockupData.contact.gmail;
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.warn("Failed to fetch session for 404 page:", e);
  }

  const isAdmin = Boolean(session?.user && session.user.role === "ADMIN");
  const backHref = isAdmin ? "/admin" : "/";
  const backText = isAdmin ? contentData.notFound.backToAdmin : contentData.notFound.backToHome;

  try {
    const contactData = await prisma.contact.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (contactData?.gmail?.trim()) {
      supportEmail = contactData.gmail.trim();
    } else {
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        orderBy: { createdAt: "asc" },
      });
      if (adminUser?.email?.trim()) {
        supportEmail = adminUser.email.trim();
      }
    }
  } catch (e) {
    console.warn("Failed to fetch contact gmail for 404 page:", e);
  }

  return (
    <MainLayout>
      <div className="relative w-full min-h-[calc(100dvh-65px)] flex flex-col justify-center items-center py-6 sm:py-10 lg:py-12 overflow-hidden bg-paper">
        {/* Subtle Japanese Grid Motif */}
        <div className="absolute inset-0 bg-[radial-gradient(#b04749_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        {/* Giant Watermark Background "404" blending with Paper Background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[48vw] sm:text-[38vw] md:text-[32vw] lg:text-[360px] xl:text-[400px] font-extrabold tracking-tighter select-none pointer-events-none z-0 leading-none text-primary/[0.08]"
          aria-hidden="true"
        >
          404
        </div>

        <Container
          size="default"
          className="relative z-10 text-center space-y-6 sm:space-y-7 max-w-2xl mx-auto my-auto"
        >
          {/* Badge Accent */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="font-serif text-xs font-semibold text-primary tracking-widest uppercase">
              {contentData.notFound.badgeKanji}
            </span>
          </div>

          {/* Main Title Header */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight">
              {contentData.notFound.heading}
            </h1>
            <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full" />
          </div>

          {/* Contextual Description */}
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-md mx-auto">
            {contentData.notFound.description}
          </p>

          {/* Back Action Button */}
          <div className="pt-1 flex justify-center">
            <Link href={backHref}>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowLeft className="w-4 h-4" />}
                iconPosition="left"
                className="px-6 py-2.5 shadow-xs"
              >
                {backText}
              </Button>
            </Link>
          </div>

          {/* Bottom Contact Support Section */}
          <div className="pt-6 sm:pt-7 border-t border-border-warm/60 mt-6 sm:mt-8 space-y-3">
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              {contentData.notFound.supportText}
            </p>
            <div className="flex items-center justify-center">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-mono font-medium text-primary hover:text-[#993b3d] bg-primary/5 hover:bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg transition-all"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{contentData.notFound.contactLabel} ({supportEmail})</span>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
