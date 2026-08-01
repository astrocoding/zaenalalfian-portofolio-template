"use client";

import * as React from "react";
import {
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

export type AlertVariant = "error" | "success" | "warn" | "info";

export interface AlertBannerProps {
    variant?: AlertVariant;
    message?: React.ReactNode;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    onClose?: () => void;
    className?: string;
    size?: "sm" | "md";
}

const variantStyles: Record<
    AlertVariant,
    {
        container: string;
        text: string;
        icon: React.ComponentType<{ className?: string }>;
        closeHover: string;
    }
> = {
    error: {
        container: "bg-rose-50 border-rose-200 text-rose-700",
        text: "text-rose-700",
        icon: AlertCircle,
        closeHover: "hover:bg-rose-100 hover:text-rose-900",
    },
    success: {
        container: "bg-emerald-50 border-emerald-200 text-emerald-700",
        text: "text-emerald-700",
        icon: CheckCircle2,
        closeHover: "hover:bg-emerald-100 hover:text-emerald-900",
    },

    warn: {
        container: "bg-amber-50 border-amber-200 text-amber-800",
        text: "text-amber-800",
        icon: AlertTriangle,
        closeHover: "hover:bg-amber-100 hover:text-amber-950",
    },
    info: {
        container: "bg-cyan-50 border-cyan-200 text-cyan-800",
        text: "text-cyan-800",
        icon: Info,
        closeHover: "hover:bg-cyan-100 hover:text-cyan-950",
    },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
    variant = "error",
    message,
    children,
    icon,
    onClose,
    className = "",
    size = "md",
}) => {
    const content = message || children;
    if (!content) return null;

    const currentVariant = variantStyles[variant] || variantStyles.error;
    const DefaultIcon = currentVariant.icon;

    const paddingClass = size === "sm" ? "p-3.5 rounded-md" : "p-4 rounded-lg";

    return (
        <div
            className={`border text-xs flex items-center justify-between gap-3 ${paddingClass} ${currentVariant.container} ${className}`}
            role="alert"
        >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
                {icon ? (
                    <span className="shrink-0">{icon}</span>
                ) : (
                    <DefaultIcon className="w-4 h-4 shrink-0" />
                )}
                <div className="min-w-0 leading-relaxed font-sans">{content}</div>
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className={`p-1 rounded transition-colors shrink-0 cursor-pointer ${currentVariant.closeHover}`}
                    aria-label="Close alert banner"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
