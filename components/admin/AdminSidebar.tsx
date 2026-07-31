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
  GraduationCap,
  Wrench,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { useSidebar } from "@/components/admin/SidebarContext";

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
  { label: "Education", href: "/admin/education", icon: GraduationCap, kanji: "学歴" },
  { label: "Skillsets", href: "/admin/skillsets", icon: Wrench, kanji: "技能" },
  { label: "Users & Access", href: "/admin/users", icon: Users, kanji: "ユーザー" },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close mobile drawer on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
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
            onClick={() => setMobileOpen(false)}
            title={isCollapsed ? item.label : undefined}
            className={`group relative w-full h-11 flex items-center rounded-md transition-colors duration-200 overflow-hidden ${
              isActive
                ? "bg-primary text-white font-semibold shadow-2xs"
                : "text-ink-muted hover:text-ink hover:bg-black/5"
            }`}
          >
            {/* Fixed 48px Left Box for Icon: Anchors icon center at exactly 36px from sidebar border */}
            <div className="w-12 h-11 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 shrink-0" />
            </div>

            {/* Text & Kanji Container: Fades out and clips gracefully during width collapse */}
            <div
              className={`flex items-center justify-between flex-1 min-w-0 pr-3.5 transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                  : "opacity-100 w-auto"
              }`}
            >
              <span className="truncate text-sm font-medium">{item.label}</span>
              <span
                className={`text-[10px] font-serif shrink-0 ml-2 ${
                  isActive ? "text-white/80" : "text-primary/50"
                }`}
              >
                {item.kanji}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  const renderUserActions = () => (
    <div className="pt-4 border-t border-border-subtle space-y-2">
      <Link
        href="/"
        target="_blank"
        onClick={() => setMobileOpen(false)}
        title={isCollapsed ? "View Public Site" : undefined}
        className="w-full h-10 flex items-center rounded-md text-xs font-mono text-ink-muted hover:text-primary hover:bg-black/5 transition-colors duration-200 overflow-hidden"
      >
        <div className="w-12 h-10 flex items-center justify-center shrink-0">
          <ExternalLink className="w-5 h-5 shrink-0" />
        </div>
        <div
          className={`flex items-center flex-1 min-w-0 pr-3.5 transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "opacity-0 w-0 overflow-hidden pointer-events-none"
              : "opacity-100 w-auto"
          }`}
        >
          <span className="truncate">View Public Site</span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        title={isCollapsed ? "Sign Out / ログアウト" : undefined}
        className="w-full h-10 flex items-center rounded-md text-xs font-mono text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer font-medium overflow-hidden"
      >
        <div className="w-12 h-10 flex items-center justify-center shrink-0">
          <LogOut className="w-5 h-5 shrink-0" />
        </div>
        <div
          className={`flex items-center flex-1 min-w-0 pr-3.5 transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "opacity-0 w-0 overflow-hidden pointer-events-none"
              : "opacity-100 w-auto"
          }`}
        >
          <span className="truncate">Sign Out / ログアウト</span>
        </div>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile & Tablet Header Bar (<1024px) */}
      <div className="lg:hidden sticky top-0 z-50 bg-surface border-b border-border-warm px-4 h-[63px] flex items-center justify-between relative shadow-xs shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <Image
            src="/zen.svg?v=2"
            alt="Zaenal Alfian Logo"
            width={34}
            height={34}
            className="w-8.5 h-8.5 object-contain shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="font-serif font-bold text-sm text-ink leading-snug truncate">
              {user?.name || "Admin User"}
            </h2>
            <p className="text-[10px] font-mono text-ink-muted truncate -mt-0.5">
              @{user?.username || "admin"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md text-ink hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer border border-border-warm bg-paper shrink-0 ml-2"
          aria-label={mobileOpen ? "Close Admin Navigation Menu" : "Open Admin Navigation Menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
        </button>

        {/* Mobile Slide-Over Drawer (Left-to-Right Slide Animation) */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Dark Backdrop Overlay */}
              <motion.div
                key="mobile-sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden"
              />

              {/* Slide-over Drawer Panel */}
              <motion.div
                key="mobile-sidebar-drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-surface border-r border-border-warm shadow-2xl flex flex-col justify-between p-5 lg:hidden select-none overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border-subtle shrink-0">
                    <div className="flex items-center space-x-3 min-w-0">
                      <Image
                        src="/zen.svg?v=2"
                        alt="Zaenal Alfian Logo"
                        width={34}
                        height={34}
                        className="w-8.5 h-8.5 object-contain shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h2 className="font-serif font-bold text-sm text-ink leading-snug truncate">
                          {user?.name || "Admin User"}
                        </h2>
                        <p className="text-[10px] font-mono text-ink-muted truncate -mt-0.5">
                          @{user?.username || "admin"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
                      title="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {renderNavItems()}
                </div>

                {renderUserActions()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Persistent Fixed Left Sidebar (>=1024px) */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 h-full bg-surface border-r border-border-warm pt-0 pb-6 transition-all duration-300 ease-in-out select-none overflow-hidden ${
          isCollapsed ? "w-[72px] px-3" : "w-64 px-3"
        }`}
      >
        <div className="space-y-6">
          {/* Header area */}
          <div className="relative w-full h-[63px] border-b border-border-subtle flex items-center justify-between shrink-0 overflow-hidden">
            {/* Logo + User Info */}
            <div className="flex items-center space-x-3 min-w-0 pl-1.5">
              {/* Logo / Hover Expand Trigger in Compact mode */}
              <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                {isCollapsed ? (
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    title="Expand sidebar"
                    className="group relative w-9 h-9 rounded-md flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Image
                      src="/zen.svg?v=2"
                      alt="Zaenal Alfian Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/10 rounded-md border border-primary/30 text-primary shadow-xs">
                      <svg
                        className="w-4.5 h-4.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="4" />
                        <path d="M9 3v18" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <Image
                    src="/zen.svg?v=2"
                    alt="Zaenal Alfian Logo"
                    width={34}
                    height={34}
                    className="w-8.5 h-8.5 object-contain shrink-0"
                  />
                )}
              </div>

              {/* User info (Smooth fade/clip) */}
              <div
                className={`flex flex-col justify-center min-w-0 transition-all duration-300 ease-in-out ${
                  isCollapsed
                    ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                    : "opacity-100 w-auto"
                }`}
              >
                <h2 className="font-serif font-bold text-sm text-ink leading-snug truncate">
                  {user?.name || "Admin User"}
                </h2>
                <p className="text-[10px] font-mono text-ink-muted truncate -mt-0.5">
                  @{user?.username || "admin"}
                </p>
              </div>
            </div>

            {/* Collapse button (Visible in open mode) */}
            <div
              className={`transition-all duration-300 ease-in-out pr-1 ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                  : "opacity-100 w-auto"
              }`}
            >
              <button
                type="button"
                onClick={toggleSidebar}
                title="Collapse sidebar"
                className="w-8 h-8 rounded-md border border-border-warm bg-watermark-surface text-ink-muted hover:text-ink hover:border-primary/50 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="4" />
                  <path d="M9 3v18" />
                </svg>
              </button>
            </div>
          </div>

          {renderNavItems()}
        </div>

        {renderUserActions()}
      </aside>
    </>
  );
};



