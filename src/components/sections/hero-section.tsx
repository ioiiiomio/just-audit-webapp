import { getImageProps } from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Media } from "@/payload-types";
import Link from "next/link";

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaLabel: string;
    backgroundImage?: Media | number | string | null;
}

const FALLBACK = "/images/hero-team.png";

export function HeroSection({
                                title,
                                subtitle,
                                ctaLabel,
                                backgroundImage,
                            }: HeroSectionProps) {
    const imageUrl =
        (backgroundImage && typeof backgroundImage === "object"
            ? backgroundImage.url
            : null) ?? FALLBACK;

    const common = { alt: "", fill: true, src: imageUrl } as const;

    // Desktop: full quality, photo is clearly visible
    const {
        props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, sizes: "100vw", quality: 75 });

    // Mobile: photo sits under a 90% milk overlay, so a small, low-quality file is enough
    const {
        props: { srcSet: mobileSrcSet, ...imgProps },
    } = getImageProps({ ...common, sizes: "50vw", quality: 30 });

    return (
        <section className="relative flex min-h-[500px] flex-col justify-center overflow-hidden py-24 lg:min-h-[600px] lg:py-32">
            <picture>
                <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
                <img
                    {...imgProps}
                    srcSet={mobileSrcSet}
                    sizes="50vw"
                    alt=""
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="object-cover"
                />
            </picture>

            {/* Desktop: gradient anchored to the Container's content edge, not the viewport */}
            <div className="absolute inset-y-0 left-0 hidden w-[calc(max(4rem,50%_-_36rem)_+_50rem)] bg-gradient-to-r from-brand-milk from-[28%] via-brand-milk/70 via-[55%] to-transparent lg:block" />
            <div className="absolute inset-0 bg-brand-milk/90 lg:hidden" />

            <Container className="relative z-10">
                <div className="max-w-lg">
                    <h1 className="font-heading text-3xl font-bold uppercase leading-[1.2] text-brand-green lg:text-[3rem]">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-md font-body text-base text-brand-black/80 lg:mt-6 lg:text-lg">
                        {subtitle}
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="mt-8 bg-brand-green font-heading text-base text-brand-milk hover:bg-brand-green/90 lg:mt-10 lg:text-lg"
                    >
                        <Link href="#contact">{ctaLabel}</Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
