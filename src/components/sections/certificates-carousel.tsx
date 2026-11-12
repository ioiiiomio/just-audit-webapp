"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CertificateModal } from "@/components/certificate-modal";
import { PdfPageCanvas } from "@/components/pdf-page-canvas";
import { resolveCertificateImage } from "@/lib/certificate-image";
import type { Certificate } from "@/payload-types";

interface CertificatesCarouselProps {
  certificates: Certificate[];
}

interface SelectedCertificate {
  title: string;
  url: string;
  isPdf: boolean;
}

export function CertificatesCarousel({
  certificates,
}: CertificatesCarouselProps) {
  const [selected, setSelected] = useState<SelectedCertificate | null>(null);

  return (
    <>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {certificates.map((cert) => {
            const resolved = resolveCertificateImage(cert);
            if (!resolved) return null;

            const title = cert.title?.trim();

            return (
              <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
                <button
                  type="button"
                  aria-label={title || "Certificate"}
                  onClick={() =>
                    setSelected({
                      title: title ?? "",
                      url: resolved.url,
                      isPdf: resolved.isPdf,
                    })
                  }
                  className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-brand-beige bg-white text-left"
                >
                  <div className="relative mx-auto h-[180px] w-full bg-brand-beige/30 sm:h-[200px] md:h-[240px] md:w-[320px] lg:h-[260px] lg:w-[360px]">
                    {resolved.isPdf ? (
                      <PdfPageCanvas
                        url={resolved.url}
                        targetWidth={480}
                        className="h-full w-full"
                      />
                    ) : (
                      <Image
                        src={resolved.url}
                        alt={title ?? ""}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  {/* Only render the caption when there is something to show —
                      empty <h3>s were failing Lighthouse's "headings have content" audit */}
                  {(title || cert.issuedBy) && (
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      {title && (
                        <h3 className="font-label text-sm font-medium text-brand-black">
                          {title}
                        </h3>
                      )}
                      {cert.issuedBy && (
                        <p className="font-body text-xs text-brand-black/70">
                          {cert.issuedBy}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>

      {selected && (
        <CertificateModal
          title={selected.title}
          url={selected.url}
          isPdf={selected.isPdf}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
