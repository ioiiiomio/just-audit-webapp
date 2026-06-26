// src/components/sections/certificates-carousel.tsx
"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Certificate = {
  id: string;
  title: string;
  fileType: "image" | "pdf";
  thumbnail: { url: string; alt?: string };
};

export function CertificatesCarousel({
  certificates,
  locale,
}: {
  certificates: Certificate[];
  locale: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Certificate | null>(null);

  // Close on Escape, lock background scroll while lightbox is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  const handleCardClick = (cert: Certificate) => {
    if (cert.fileType === "pdf") {
      window.open(
        `/${locale}/certificates/${cert.id}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      setActive(cert);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {certificates
            .filter((cert) => cert.thumbnail.url)
            .map((cert) => (
              <button
                key={cert.id}
                data-card
                type="button"
                onClick={() => handleCardClick(cert)}
                className="relative aspect-[4/3] w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02] sm:w-[360px]"
              >
                <Image
                  src={cert.thumbnail.url}
                  alt={cert.thumbnail.alt ?? cert.title}
                  fill
                  className="object-contain p-3"
                />
              </button>
            ))}
        </div>
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByCard(-1)}
          className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md sm:flex"
        >
          <ChevronLeft className="size-5 text-brand-green" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByCard(1)}
          className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md sm:flex"
        >
          <ChevronRight className="size-5 text-brand-green" />
        </button>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.thumbnail.url}
              alt={active.thumbnail.alt ?? active.title}
              width={1000}
              height={1300}
              className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
