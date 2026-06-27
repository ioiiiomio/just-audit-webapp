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

            return (
              <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
                <button
                  type="button"
                  onClick={() =>
                    setSelected({
                      title: cert.title,
                      url: resolved.fullUrl,
                      isPdf: resolved.isPdf,
                    })
                  }
                  className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-brand-beige bg-white text-left"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={resolved.thumbnailUrl}
                      alt={cert.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3 className="font-label text-sm font-medium text-brand-black">
                      {cert.title}
                    </h3>
                    {cert.issuedBy && (
                      <p className="font-body text-xs text-brand-black/60">
                        {cert.issuedBy}
                      </p>
                    )}
                  </div>
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
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
