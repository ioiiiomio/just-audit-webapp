"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Certificate } from "@/payload-types";

interface CertificatesCarouselProps {
  certificates: Certificate[];
}

export function CertificatesCarousel({
  certificates,
}: CertificatesCarouselProps) {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {certificates.map((cert) => {
          const image = typeof cert.image === "object" ? cert.image : null;
          if (!image?.url) return null;

          return (
            <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="flex h-full flex-col overflow-hidden rounded-lg border border-brand-beige bg-white">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.url}
                    alt={image.alt || cert.title}
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
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
