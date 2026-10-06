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

export type CarouselImage = {
    id: number | string;
    url: string;
    alt: string;
};

const MAX_SLIDES = 8;

export function GalleryCarousel({ images }: { images: CarouselImage[] }) {
    const slides = images.slice(0, MAX_SLIDES);
    const [selected, setSelected] = useState<CarouselImage | null>(null);

    if (slides.length === 0) return null;

    return (
        <>
            <Carousel
                opts={{ align: "start", loop: slides.length > 3 }}
                className="w-full"
            >
                <CarouselContent>
                    {slides.map((img) => (
                        <CarouselItem key={img.id} className="md:basis-1/2 lg:basis-1/3">
                            <button
                                type="button"
                                onClick={() => setSelected(img)}
                                aria-label={img.alt || undefined}
                                className="block w-full overflow-hidden rounded-lg border border-brand-beige bg-white"
                            >
                                <div className="relative aspect-[4/3] w-full bg-brand-beige/30">
                                    <Image
                                        src={img.url}
                                        alt={img.alt}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {slides.length > 1 && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>

            {selected && (
                <CertificateModal
                    title={selected.alt}
                    url={selected.url}
                    isPdf={false}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    );
}