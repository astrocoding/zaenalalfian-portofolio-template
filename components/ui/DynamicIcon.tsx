import * as React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DynamicIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name?: string | null;
  fallback?: LucideIcon;
  className?: string;
}

/**
 * Normalizes string formats (kebab-case, camelCase, lowercase) to PascalCase
 * e.g. "shield-check" -> "ShieldCheck", "code-2" -> "Code2", "cpu" -> "Cpu"
 */
export function normalizeIconName(name: string): string {
  if (!name) return "";
  const cleaned = name.trim();
  if (cleaned.includes("-")) {
    return cleaned
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function getLucideIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName || typeof iconName !== "string" || !iconName.trim()) {
    return null;
  }
  const pascalName = normalizeIconName(iconName);
  const IconComponent = (LucideIcons as Record<string, unknown>)[pascalName];

  if (
    IconComponent &&
    (typeof IconComponent === "function" || typeof IconComponent === "object")
  ) {
    return IconComponent as LucideIcon;
  }
  return null;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback: FallbackIcon,
  className = "w-5 h-5 text-primary",
  ...props
}) => {
  const IconComponent = getLucideIcon(name) || FallbackIcon;

  if (!IconComponent) return null;

  return React.createElement(IconComponent, { className, ...props });
};
