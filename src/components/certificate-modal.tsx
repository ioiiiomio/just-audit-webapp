"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { PdfPageCanvas } from "@/components/pdf-page-canvas";

interface CertificateModalProps {
  title: string;
  url: string;
  isPdf: boolean;
  onClose: () => void;
}

export function CertificateModal({ title, url, isPdf, onClose }: CertificateModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="size-6" />
      </button>

      <div
        className="relative h-[92vh] max-h-[1400px] w-auto max-w-[95vw] aspect-[1/1.4142] overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isPdf ? (
          <PdfPageCanvas url={url} targetWidth={1200} className="h-full w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={title} className="h-full w-full object-contain" />
        )}
      </div>
    </div>
  );
}
