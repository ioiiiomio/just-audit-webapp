// src/components/pdf-viewer.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, X } from "lucide-react";

export function PdfViewer({
  sourceUrl,
  title,
}: {
  sourceUrl: string;
  title: string;
}) {
  const router = useRouter();

  const handleClose = () => {
    // Opened via window.open in most cases — try closing the tab first.
    window.close();
    // If the tab is still around (e.g. opened directly via shared link), fall back.
    setTimeout(() => router.back(), 50);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="truncate font-heading text-lg text-white">{title}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={sourceUrl}
            download
            className="flex size-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Download"
          >
            <Download className="size-5" />
          </Link>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="flex size-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
      <iframe
        src={sourceUrl}
        title={title}
        className="w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}
