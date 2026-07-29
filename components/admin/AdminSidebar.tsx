"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  FileCode,
  Users,
  Briefcase,
  Wrench,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

export interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    username?: string;
    role?: string;
  } | null;
}

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, kanji: "概要" },
  { label: "Profile & About", href: "/admin/profile", icon: UserCheck, kanji: "設定" },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2, kanji: "実績" },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen, kanji: "記事" },
  { label: "Documentation", href: "/admin/docs", icon: FileCode, kanji: "文書" },
  { label: "Experiences", href: "/admin/experiences", icon: Briefcase, kanji: "経歴" },
  { label: "Skillsets", href: "/admin/skillsets", icon: Wrench, kanji: "技能" },
  { label: "Users & Access", href: "/admin/users", icon: Users, kanji: "ユーザー" },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close mobile drawer on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  if (pathname === "/admin/login") return null;

  const renderNavItems = () => (
    <nav className="space-y-1" aria-label="Admin Navigation">
      {adminNavItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white font-semibold shadow-2xs"
                : "text-ink-muted hover:text-ink hover:bg-black/5"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            <span
              className={`text-[10px] font-serif ${
                isActive ? "text-white/80" : "text-primary/50"
              }`}
            >
              {item.kanji}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const renderUserActions = () => (
    <div className="pt-4 border-t border-border-subtle space-y-4">
      {user && (
        <div className="p-3 rounded-md bg-paper border border-border-subtle flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-serif shrink-0">
            {user.name ? user.name.charAt(0) : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink truncate">{user.name || "Admin User"}</p>
            <p className="text-[10px] font-mono text-ink-muted truncate">@{user.username || "admin"}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center space-x-2 text-xs font-mono text-ink-muted hover:text-primary py-2.5 rounded-md hover:bg-black/5 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center justify-center space-x-2 text-xs font-mono text-rose-600 hover:bg-rose-50 py-2.5 rounded-md transition-colors w-full cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / ログアウト</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile & Tablet Header Bar (Visible up to LG screens <1024px) */}
      <div className="lg:hidden sticky top-0 z-50 bg-surface border-b border-border-warm px-4 py-3.5 relative shadow-xs shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/zen.svg?v=2"
              alt="Zaenal Alfian Logo"
              width={34}
              height={34}
              className="w-8.5 h-8.5 object-contain"
            />
            <div>
              <h2 className="font-serif font-bold text-sm text-ink leading-tight">Admin Portal</h2>
              <span className="text-[9px] font-mono text-ink-muted uppercase">管理パネル</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-ink hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer border border-border-warm bg-paper"
            aria-label={isOpen ? "Close Admin Navigation Menu" : "Open Admin Navigation Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
          </button>
        </div>

        {/* Mobile & Tablet Floating Drawer Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="admin-sidebar-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 z-50 bg-surface border-b border-border-warm shadow-2xl overflow-y-auto max-h-[calc(100vh-65px)] px-4 sm:px-6 py-6 space-y-5"
            >
              {renderNavItems()}
              {renderUserActions()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Persistent Fixed Left Sidebar (Visible on LG screens 1024px+) */}
      <aside className="hidden lg:flex w-64 shrink-0 h-full bg-surface border-r border-border-warm p-6 flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
            <Image
              src="/zen.svg?v=2"
              alt="Zaenal Alfian Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <div>
              <h2 className="font-serif font-bold text-base text-ink leading-tight">Admin Portal</h2>
              <span className="text-[10px] font-mono text-ink-muted uppercase">管理パネル</span>
            </div>
          </div>

          {renderNavItems()}
        </div>

        {renderUserActions()}
      </aside>
    </>
  );
};
