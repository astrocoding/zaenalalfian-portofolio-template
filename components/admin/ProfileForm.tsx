"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Save,
  AlertCircle,
  CheckCircle2,
  User,
  FileText,
  Eye,
  EyeOff,
  Briefcase,
  Share2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { updateProfileAndAboutAction } from "@/app/actions/admin";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

export interface ProfileFormProps {
  userId: string;
  initialUser: {
    name: string;
    username: string;
    email: string;
    position?: string | null;
    activity?: string | null;
    experience?: string | null;
    location?: string | null;
    availability?: string | null;
    quotes?: string | null;
    bio?: string | null;
    resume?: string | null;
  };
  initialAbout?: {
    id?: string;
    title: string;
    subtitle: string;
    excerpt: string;
    description: string;
  } | null;
  initialContact?: {
    gmail?: string | null;
    whatsapp?: string | null;
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  } | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  initialUser,
  initialAbout,
  initialContact,
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [userFormData, setUserFormData] = React.useState({
    name: initialUser?.name || "",
    username: initialUser?.username || "",
    email: initialUser?.email || "",
    password: "",
    confirmPassword: "",
    position: initialUser?.position || "",
    activity: initialUser?.activity || "",
    experience: initialUser?.experience || "",
    location: initialUser?.location || "",
    availability: initialUser?.availability || "",
    quotes: initialUser?.quotes || "",
    bio: initialUser?.bio || "",
    resume: initialUser?.resume || "",
  });

  const [aboutFormData, setAboutFormData] = React.useState({
    title: initialAbout?.title || "Behind the Architecture",
    subtitle: initialAbout?.subtitle || "Bridging Design Vision & Technical Execution",
    excerpt:
      initialAbout?.excerpt ||
      "I am Zaenal Alfian, a Senior Full-Stack Engineer and Frontend Architect with over 6 years of experience building mission-critical web applications, enterprise design systems, and high-performance serverless backends.",
    description:
      initialAbout?.description ||
      "My journey in software development is rooted in a passion for craftsmanship. Over the past 6+ years, I have architected web platforms that serve millions of requests, led engineering teams in adopting modern frameworks like Next.js 16 and React 19, and built domain-driven design systems from scratch.\n\nMy philosophy is heavily influenced by traditional Japanese minimalism (*Wabi-Sabi* & *Ma*) — eliminating unnecessary clutter to let core function and performance shine. Every line of code, database query, and UI component is crafted with intentionality.\n\nWhether designing micro-frontends, optimizing PostgreSQL query access with Prisma 7, or fine-tuning Core Web Vitals to 99/100 scores, I focus on delivering long-term architectural longevity and delightful user experiences.",
  });

  const [contactFormData, setContactFormData] = React.useState({
    gmail: initialContact?.gmail || "zaenalalfian20@gmail.com",
    whatsapp: initialContact?.whatsapp || "",
    github: initialContact?.github || "https://github.com/astrocoding",
    linkedin: initialContact?.linkedin || "https://www.linkedin.com/in/zaenal-alfian/",
    instagram: initialContact?.instagram || "https://www.instagram.com/zenovasi/",
    facebook: initialContact?.facebook || "https://www.facebook.com/zaenal.alfian.2025/",
  });

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Password confirmation validation
    if (userFormData.password || userFormData.confirmPassword) {
      if (userFormData.password !== userFormData.confirmPassword) {
        setError("Password and Confirm Password do not match / パスワードが一致しません。");
        setLoading(false);
        return;
      }
    }

    const res = await updateProfileAndAboutAction(
      userId,
      userFormData,
      aboutFormData,
      contactFormData
    );

    setLoading(false);
    if (res.success) {
      setSuccess("Profile, About section, & Contact details successfully updated! / プロフィール情報を更新しました。");
      setUserFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      router.refresh();
    } else {
      setError(res.error || "Failed to update profile data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Profile & About Section"
        showSearch={false}
        showBadge={false}
        showSaveDraft={false}
        loading={loading}
        onPublish={handleSubmit}
        primaryActionLabel="Save All"
      />

      <div className="pt-[87px] px-4 sm:px-6 lg:px-6 space-y-6 w-full">
        {error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

      {/* 1. Account Settings Card */}
      <div className="bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-border-subtle">
          <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink">User Account Credentials / アカウント設定</h2>
            <p className="text-xs text-ink-muted font-sans">Update your login profile details and security password.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Full Name / 氏名 *</label>
          <input
            type="text"
            required
            value={userFormData.name}
            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
            placeholder="e.g. Zaenal Alfian"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Username / ユーザー名 *</label>
            <input
              type="text"
              required
              value={userFormData.username}
              onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
              placeholder="e.g. zaenal"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Email Address / メール *</label>
            <input
              type="email"
              required
              value={userFormData.email}
              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              placeholder="e.g. admin@zaenalalfian.dev"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              New Password / 新しいパスワード (blank to keep)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Confirm New Password / 確認用パスワード
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={userFormData.confirmPassword}
                onChange={(e) => setUserFormData({ ...userFormData, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Professional Profile & Bio Metadata Card */}
      <div className="bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-border-subtle">
          <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink">Professional Profile Attributes / 職歴・プロフィール属性</h2>
            <p className="text-xs text-ink-muted font-sans">Manage position, activity, experience years, location, availability status, quotes, bio, and resume link.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Position / 役職・ポジション</label>
            <input
              type="text"
              value={userFormData.position}
              onChange={(e) => setUserFormData({ ...userFormData, position: e.target.value })}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Current Activity / 現在の活動</label>
            <input
              type="text"
              value={userFormData.activity}
              onChange={(e) => setUserFormData({ ...userFormData, activity: e.target.value })}
              placeholder="e.g. Architecting ERP & Next.js Systems"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Experience / 開発経験年数</label>
            <input
              type="text"
              value={userFormData.experience}
              onChange={(e) => setUserFormData({ ...userFormData, experience: e.target.value })}
              placeholder="e.g. 6+ Years"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Location / 拠点・地域</label>
            <input
              type="text"
              value={userFormData.location}
              onChange={(e) => setUserFormData({ ...userFormData, location: e.target.value })}
              placeholder="e.g. Karawang, Indonesia (Remote Available)"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Availability Status / 稼働状況</label>
            <input
              type="text"
              value={userFormData.availability}
              onChange={(e) => setUserFormData({ ...userFormData, availability: e.target.value })}
              placeholder="e.g. Open for Senior Roles & Tech Consulting"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Personal Quote / モットー・座右の銘</label>
            <input
              type="text"
              value={userFormData.quotes}
              onChange={(e) => setUserFormData({ ...userFormData, quotes: e.target.value })}
              placeholder="e.g. Crafting clean architecture with intentionality."
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Resume Document Link / 履歴書・CV リンク</label>
            <input
              type="text"
              value={userFormData.resume}
              onChange={(e) => setUserFormData({ ...userFormData, resume: e.target.value })}
              placeholder="e.g. https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Short Bio Summary / プロフィール略歴</label>
          <textarea
            rows={2}
            value={userFormData.bio}
            onChange={(e) => setUserFormData({ ...userFormData, bio: e.target.value })}
            placeholder="A short introductory tagline for headers and cards..."
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
          />
        </div>
      </div>

      {/* 3. Portfolio About Data Card */}
      <div className="bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-border-subtle">
          <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink">About Page Content / 自己紹介コンテンツ</h2>
            <p className="text-xs text-ink-muted font-sans">Manage title, subtitle, excerpt summary, and full bio story paragraphs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Main Title / タイトル *</label>
            <input
              type="text"
              required
              value={aboutFormData.title}
              onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
              placeholder="Behind the Architecture"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Subtitle / サブタイトル *</label>
            <input
              type="text"
              required
              value={aboutFormData.subtitle}
              onChange={(e) => setAboutFormData({ ...aboutFormData, subtitle: e.target.value })}
              placeholder="Bridging Design Vision & Technical Execution"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Excerpt Summary / 概要（ショート説明） *</label>
          <textarea
            required
            rows={3}
            value={aboutFormData.excerpt}
            onChange={(e) => setAboutFormData({ ...aboutFormData, excerpt: e.target.value })}
            placeholder="Short bio summary displayed on banner headers..."
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Full Description Story / 詳細説明（複数パラグラフ対応） *</label>
          <textarea
            required
            rows={7}
            value={aboutFormData.description}
            onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })}
            placeholder="My journey in software development..."
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans leading-relaxed"
          />
          <span className="text-[10px] font-mono text-ink-muted block mt-1">
            Tip: Press Enter twice to create paragraph line breaks on the public /about page.
          </span>
        </div>
      </div>

      {/* 4. Contact & Social Media Links Card */}
      <div className="bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-border-subtle">
          <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
            <Share2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink">Contact &amp; Social Links / 連絡先 &amp; SNS リンク</h2>
            <p className="text-xs text-ink-muted font-sans">Manage your email contact, social media profiles, and messaging links.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Gmail Contact / メール</span>
            </label>
            <input
              type="email"
              value={contactFormData.gmail}
              onChange={(e) => setContactFormData({ ...contactFormData, gmail: e.target.value })}
              placeholder="e.g. zaenalalfian20@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp / 電話・チャット (Optional)</span>
            </label>
            <input
              type="text"
              value={contactFormData.whatsapp}
              onChange={(e) => setContactFormData({ ...contactFormData, whatsapp: e.target.value })}
              placeholder="e.g. +6281234567890"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-ink" />
              <span>GitHub Profile URL / GitHub リンク</span>
            </label>
            <input
              type="url"
              value={contactFormData.github}
              onChange={(e) => setContactFormData({ ...contactFormData, github: e.target.value })}
              placeholder="https://github.com/astrocoding"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>LinkedIn Profile URL / LinkedIn リンク</span>
            </label>
            <input
              type="url"
              value={contactFormData.linkedin}
              onChange={(e) => setContactFormData({ ...contactFormData, linkedin: e.target.value })}
              placeholder="https://www.linkedin.com/in/zaenal-alfian/"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-rose-600" />
              <span>Instagram Profile URL / Instagram リンク</span>
            </label>
            <input
              type="url"
              value={contactFormData.instagram}
              onChange={(e) => setContactFormData({ ...contactFormData, instagram: e.target.value })}
              placeholder="https://www.instagram.com/zenovasi/"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink flex items-center space-x-1.5">
              <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Facebook Profile URL / Facebook リンク</span>
            </label>
            <input
              type="url"
              value={contactFormData.facebook}
              onChange={(e) => setContactFormData({ ...contactFormData, facebook: e.target.value })}
              placeholder="https://www.facebook.com/zaenal.alfian.2025/"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            icon={<Save className="w-4 h-4" />}
          >
            {loading ? "Saving Changes..." : "Save All"}
          </Button>
        </div>
      </div>
    </div>
  </form>
);
};
