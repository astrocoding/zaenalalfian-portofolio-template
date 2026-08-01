"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { X, Save, UserPlus, Eye, EyeOff, User } from "lucide-react";
import { createUserAction, updateUserAction } from "@/app/actions/admin";

export interface UserData {
  id?: string;
  name?: string | null;
  username?: string;
  email?: string;
  role?: string;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserData | null;
  isEdit?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: isEdit && initialData ? initialData.name || "" : "",
    username: isEdit && initialData ? initialData.username || "" : "",
    email: isEdit && initialData ? initialData.email || "" : "",
    password: "",
    confirmPassword: "",
    role:
      isEdit && initialData
        ? (initialData.role as "ADMIN" | "USER") || "ADMIN"
        : "ADMIN",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password validations
    if (!isEdit && (!formData.password || formData.password.trim() === "")) {
      setError("Password is required for new users / パスワードは必須です。");
      setLoading(false);
      return;
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError(
          "Password and Confirm Password do not match / パスワードが一致しません。",
        );
        setLoading(false);
        return;
      }
    }

    let res;
    if (isEdit && initialData?.id) {
      res = await updateUserAction(initialData.id, {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password ? formData.password.trim() : undefined,
        role: formData.role,
      });
    } else {
      res = await createUserAction({
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role,
      });
    }

    setLoading(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || "Operation failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 shadow-2xl w-full max-w-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              {isEdit ? (
                <User className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              {isEdit
                ? "Edit User / ユーザー編集"
                : "Create User / ユーザー作成"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Banner */}
        <AlertBanner
          variant="error"
          message={error}
          onClose={() => setError(null)}
        />

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Full Name / <span className="text-primary">氏名 *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Zaenal Alfian"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Username / <span className="text-primary">ユーザー名 *</span>
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="e.g. zaenal"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Email Address / <span className="text-primary">メール *</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g. admin@zaenalalfian.dev"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Role / <span className="text-primary">権限 *</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "ADMIN" | "USER",
                  })
                }
                className="admin-select w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="ADMIN">ADMIN (Full Access)</option>
                <option value="USER">USER (Read Access)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                {isEdit
                  ? "New Password (blank to keep)"
                  : "Password / パスワード *"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required={!isEdit}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
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

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                {isEdit
                  ? "Confirm New Password"
                  : "Confirm Password / パスワード確認 *"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required={!isEdit || formData.password.trim().length > 0}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update User"
                  : "Create Admin User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
