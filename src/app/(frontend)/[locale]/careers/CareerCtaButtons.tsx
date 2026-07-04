// src/app/(frontend)/[locale]/careers/CareerCtaButtons.tsx
"use client";

import { useState } from "react";
import { CareerApplicationModal } from "./CareerApplicationModal";

interface CareerCtaButtonsProps {
  label: string;
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
    error: string;
    errorName: string;
    errorPhone: string;
    errorEmail: string;
    errorPosition: string;
    errorComment: string;
    errorResumeType: string;
    errorResumeSize: string;
  };
}

export function CareerCtaButtons({
  label,
  modalLabels,
}: CareerCtaButtonsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-green/90"
        >
          {label}
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
