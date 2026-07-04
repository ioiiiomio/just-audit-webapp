// src/components/cookie-consent.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "just-audit-cookie-consent";

interface CookieConsentProps {
  locale: string;
  labels: {
    message: string;
    policyLinkText: string;
    accept: string;
    decline: string;
  };
}

export function CookieConsent({ locale, labels }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, timestamp: Date.now() }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-black/10 bg-brand-milk px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:px-16"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm text-brand-black/80">
          {labels.message}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="underline text-brand-green hover:text-brand-green/80"
          >
            {labels.policyLinkText}
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="rounded-full border border-brand-black/20 px-5 py-2.5 text-sm font-medium text-brand-black transition hover:bg-brand-black/5"
          >
            {labels.decline}
          </button>
          <Button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-milk hover:bg-brand-green/90"
          >
            {labels.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
