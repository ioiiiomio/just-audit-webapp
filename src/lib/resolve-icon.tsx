// src/lib/resolve-icon.tsx
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function resolveIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return typeof Icon === "function" || typeof Icon === "object"
    ? (Icon as LucideIcon)
    : null;
}
