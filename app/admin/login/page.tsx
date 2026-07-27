"use client";

import * as React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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
          <Image
            src="/zen.svg?v=2"
            alt="Zaenal Alfian Logo"
            width={48}
            height={48}
            className="w-12 h-12 mx-auto object-contain"
            priority
          />
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight pt-2">
            Admin Authentication / ログイン
          </h1>
          <p className="text-xs font-mono text-ink-muted">
            Enter your email/username and password to access dashboard
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink font-medium">
              Email or Username / ユーザー名・メール *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@zaenalalfian.dev or admin"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink font-medium">
              Password / パスワード *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
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
            {loading ? "Authenticating..." : "Sign In to Admin / ログイン"}
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-border-subtle text-center text-xs text-ink-muted flex items-center justify-center space-x-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session • NextAuth Credentials</span>
        </div>
      </div>
    </div>
  );
}
