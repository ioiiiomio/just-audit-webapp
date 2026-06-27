"use client";

import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import Link from "next/link";

type AnnouncementType = "info" | "maintenance" | "success" | "warning";

type Announcement = {
  id: string | number;
  title: string;
  message?: string | null;
  type: AnnouncementType;
  link?: { label?: string | null; href?: string | null } | null;
};

type StyleConfig = { icon: typeof Info; bg: string; text: string };

const typeStyles: Record<AnnouncementType, StyleConfig> = {
  info: { icon: Info, bg: "bg-brand-green", text: "text-white" },
  maintenance: { icon: Wrench, bg: "bg-amber-700", text: "text-white" },
  success: { icon: CheckCircle2, bg: "bg-brand-green", text: "text-white" },
  warning: { icon: AlertTriangle, bg: "bg-red-700", text: "text-white" },
};

const STORAGE_KEY = "dismissed-announcements";

export function AnnouncementsBannerClient({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDismissed(stored ? JSON.parse(stored) : []);
    } catch {
      setDismissed([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore (e.g. private browsing blocks storage)
    }
  };

  // Avoid a flash of banners before localStorage is read on mount
  if (!hydrated) return null;

  const visible = announcements.filter(
    (a) => !dismissed.includes(String(a.id)),
  );
  if (visible.length === 0) return null;

  return (
    <div className="space-y-px">
      {visible.map((announcement) => {
        const { icon: Icon, bg, text } = typeStyles[announcement.type];
        const id = String(announcement.id);

        return (
          <div
            key={id}
            className={`${bg} ${text} flex items-center gap-3 px-6 py-3 lg:px-16`}
          >
            <Icon className="size-5 shrink-0" />
            <div className="flex-1 font-body text-sm">
              <span className="font-bold">{announcement.title}</span>
              {announcement.message && (
                <span className="ml-2 opacity-90">{announcement.message}</span>
              )}
              {announcement.link?.href && announcement.link?.label && (
                <Link
                  href={announcement.link.href}
                  className="ml-3 underline underline-offset-2 hover:opacity-80"
                >
                  {announcement.link.label}
                </Link>
              )}
            </div>
            <button
              onClick={() => dismiss(id)}
              aria-label="Dismiss announcement"
              className="shrink-0 opacity-80 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
