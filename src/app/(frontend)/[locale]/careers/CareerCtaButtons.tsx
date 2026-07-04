"use client";

import { useState } from "react";
import Link from "next/link";
import { CareerApplicationModal } from "./career-application-modal";

interface CareerCtaButtonsProps {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  modalLabels: {
    title: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    position: string;
    comment: string;
    resume: string;
    submit: string;
    success: string;
  };
}

export function CareerCtaButtons({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  modalLabels,
}: CareerCtaButtonsProps) {
  const [open, setOpen] = useState(false);
  const isExternalOrAnchor =
    primaryHref.startsWith("http") ||
    primaryHref.startsWith("mailto:") ||
    primaryHref.startsWith("#");

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-4">
        {isExternalOrAnchor ? (
          <a
            href={primaryHref}
            className="rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-green/90"
          >
            {primaryLabel}
          </a>
        ) : (
          <Link
            href={primaryHref}
            className="rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-green/90"
          >
            {primaryLabel}
          </Link>
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-brand-green px-6 py-3 text-sm font-medium text-brand-green transition hover:bg-brand-green/5"
        >
          {secondaryLabel}
        </button>
      </div>

      <CareerApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        labels={modalLabels}
      />
    </>
  );
}
