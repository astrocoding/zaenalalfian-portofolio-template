"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AlertBanner } from "@/components/ui/AlertBanner";

export function LoginForm() {
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Invalid credentials provided.");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12 relative overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(#b04749_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md bg-surface border border-border-warm rounded-2xl p-8 shadow-card relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            title="Zaenal Alfian's Portfolio"
            className="inline-block transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/zen.svg?v=2"
              alt="Zaenal Alfian Logo"
              width={48}
              height={48}
              className="w-12 h-12 mx-auto object-contain cursor-pointer"
              priority
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight pt-2">
            Admin Authentication
          </h1>
          <p className="text-xs font-mono text-ink-muted">
            Enter your email/username and password to access dashboard
          </p>
        </div>

        {/* Error Alert Banner */}
        <AlertBanner
          variant="error"
          message={error}
          onClose={() => setError(null)}
          size="sm"
        />

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink font-medium">
              Email or Username /{" "}
              <span className="text-secondary">ユーザー名・メール *</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@zaenalalfian.dev or admin"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink font-medium">
              Password / <span className="text-secondary">パスワード *</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full justify-center mt-2"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-border-subtle text-center text-xs text-ink-muted flex items-center justify-center space-x-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session • Zaenal Alfian</span>
        </div>
      </div>
    </div>
  );
}
