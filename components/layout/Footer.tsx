import * as React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight, Heart, Globe, Code2 } from "lucide-react";
import { Container } from "../ui/Container";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border-warm pt-16 pb-12 mt-auto text-ink">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-serif font-bold text-base">
                才
              </div>
              <span className="font-serif font-bold text-xl text-ink">Zaenal Alfian</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-md font-serif italic">
              "Simple is better than complex. Quiet design speaks louder than noise."
            </p>
            <p className="text-xs text-ink-muted leading-relaxed max-w-md">
              Senior Full-Stack Engineer, Frontend Architect, and Technical Writer building high-performance web products with clean code and minimalist design.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
              Navigation / 案内
            </h4>
            <ul className="space-y-2 text-sm font-medium text-ink-muted">
              <li>
                <Link href="/#projects" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Projects <span className="text-[10px] text-primary/50 font-serif">/ 実績</span>
                </Link>
              </li>
              <li>
                <Link href="/#blogs" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Blog Posts <span className="text-[10px] text-primary/50 font-serif">/ 記事</span>
                </Link>
              </li>
              <li>
                <Link href="/#docs" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Documentation <span className="text-[10px] text-primary/50 font-serif">/ 文書</span>
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  About Me <span className="text-[10px] text-primary/50 font-serif">/ 概要</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
              Connect / 接続
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-ink-muted">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="mailto:contact@zaenalalfian.dev"
                className="hover:text-primary transition-colors inline-flex items-center gap-2 text-primary font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>contact@zaenalalfian.dev</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <div className="flex items-center space-x-2">
            <span>© {currentYear} Zaenal Alfian. All rights reserved.</span>
            <span className="text-border-warm">•</span>
            <span className="font-serif text-primary/60">無の境地</span>
          </div>

          <div className="flex items-center space-x-1 font-mono text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-primary fill-primary inline mx-1" />
            <span>Next.js 16 & Japanese Minimalism</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
