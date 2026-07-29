import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Flame } from "lucide-react";
import { Container } from "../ui/Container";
import { GithubContributionGraph } from "../ui/GithubContributionGraph";
import { prisma } from "@/lib/prisma";
import { checkAttributionIntegrity } from "@/lib/integrity";

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export interface FooterProps {
  quotes?: string | null;
  bio?: string | null;
  contact?: {
    gmail?: string | null;
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  } | null;
}

async function getFooterData() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      include: { contact: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      quotes: adminUser?.quotes || null,
      bio: adminUser?.bio || null,
      contact: adminUser?.contact || null,
    };
  } catch (error) {
    console.warn("Failed to fetch dynamic footer data, using fallback:", error);
    return { quotes: null, bio: null, contact: null };
  }
}

export const Footer: React.FC<FooterProps> = async ({
  quotes: propQuotes,
  bio: propBio,
  contact: propContact,
}) => {
  checkAttributionIntegrity();
  const currentYear = new Date().getFullYear();
  const footerData = await getFooterData();

  const quotesText =
    propQuotes ||
    footerData.quotes ||
    "Simple is better than complex. Quiet design speaks louder than noise.";

  const bioText =
    propBio ||
    footerData.bio ||
    "Senior Full-Stack Engineer, Frontend Architect, and Technical Writer building high-performance web products with clean code and minimalist design.";

  const githubUrl =
    propContact?.github ||
    footerData.contact?.github ||
    "https://github.com/astrocoding";

  const linkedinUrl =
    propContact?.linkedin ||
    footerData.contact?.linkedin ||
    "https://www.linkedin.com/in/zaenal-alfian/";

  const instagramUrl =
    propContact?.instagram ||
    footerData.contact?.instagram ||
    "https://www.instagram.com/zenovasi/";

  const facebookUrl =
    propContact?.facebook ||
    footerData.contact?.facebook ||
    "https://www.facebook.com/zaenal.alfian.2025/";

  return (
    <footer className="bg-surface border-t border-border-warm pt-16 pb-12 mt-auto text-ink">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Brand & Mission Column */}
          <div className="md:col-span-1 lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/zen.svg?v=2"
                alt="Zaenal Alfian Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-serif font-bold text-xl text-primary uppercase">ZAENAL ALFIAN</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-md font-serif italic">
              &quot;{quotesText}&quot;
            </p>

            <p className="text-xs text-ink-muted leading-relaxed max-w-md">
              {bioText}
            </p>

            {/* GitHub Contribution Graph */}
            <GithubContributionGraph />
          </div>

          {/* Navigation & Connect Wrapper Column for Tablet Responsive Layout */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col space-y-10 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-10">
            {/* Quick Navigation Links */}
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                Navigation / 案内
              </h2>
              <ul className="space-y-2 text-sm font-medium text-ink-muted">
                <li>
                  <Link href="/projects" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Projects <span className="text-[10px] text-primary font-serif font-medium">/ 実績</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Blogs <span className="text-[10px] text-primary font-serif font-medium">/ 記事</span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Documentation <span className="text-[10px] text-primary font-serif font-medium">/ 文書</span>
                  </Link>
                </li>
                <li>
                  <Link href="/experiences" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Experiences <span className="text-[10px] text-primary font-serif font-medium">/ 経歴</span>
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Education <span className="text-[10px] text-primary font-serif font-medium">/ 学歴</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    About Me <span className="text-[10px] text-primary font-serif font-medium">/ 概要</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                Connect / 接続
              </h2>
              <div className="flex flex-col space-y-2 text-sm text-ink-muted">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Github</span>
                  <span className="text-[10px] text-primary font-serif font-medium">/ ギットハブ</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 ml-auto" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <span className="text-[10px] text-primary font-serif font-medium">/ リンクトイン</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 ml-auto" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                  <span className="text-[10px] text-primary font-serif font-medium">/ インスタグラム</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 ml-auto" />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                  <span className="text-[10px] text-primary font-serif font-medium">/ フェイスブック</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <div className="flex items-center space-x-2">
            <span>
              © {currentYear}{" - "}
              <Link href="/" className="font-bold text-secondary hover:text-primary transition-colors">
                Zaenal Alfian
              </Link>
              . All rights reserved.
            </span>
            <span className="text-border-warm">•</span>
            <span className="font-serif text-primary font-medium">無の境地</span>
          </div>

          <div className="flex items-center space-x-1 font-mono text-[11px]">
            <Flame className="w-3.5 h-3.5 text-primary fill-primary inline mr-1" />
            <span>Crafted with Passion by Zaenal Alfian</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
