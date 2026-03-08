"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  FileCode,
  Users,
  Briefcase,
  LogOut,
  ExternalLink,
} from "lucide-react";

export interface AdminSidebarProps {
  user?: any;
}

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, kanji: "概要" },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2, kanji: "実績" },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen, kanji: "記事" },
  { label: "Documentation", href: "/admin/docs", icon: FileCode, kanji: "文書" },
  { label: "Experiences", href: "/admin/experiences", icon: Briefcase, kanji: "経歴" },
  { label: "Users & Access", href: "/admin/users", icon: Users, kanji: "ユーザー" },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-surface border-b lg:border-b-0 lg:border-r border-border-warm p-4 sm:p-6 flex flex-col justify-between space-y-6">
      <div className="space-y-6">
        {/* Admin Brand Logo */}
        <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
          <div className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center font-serif font-bold text-lg">
            才
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink leading-tight">Admin Portal</h2>
            <span className="text-[10px] font-mono text-ink-muted uppercase">管理パネル</span>
          </div>
        </div>

        {/* Navigation Items */}
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
      </div>

      {/* User Badge & Actions */}
      <div className="pt-4 border-t border-border-subtle space-y-4">
        {user && (
          <div className="p-3 rounded-md bg-paper border border-border-subtle flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-serif">
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
            className="flex items-center justify-center space-x-2 text-xs font-mono text-ink-muted hover:text-primary py-2 rounded-md hover:bg-black/5 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center justify-center space-x-2 text-xs font-mono text-rose-600 hover:bg-rose-50 py-2 rounded-md transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / ログアウト</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
