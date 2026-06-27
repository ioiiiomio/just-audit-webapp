import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Media } from "@/payload-types"; // adjust path if your generated types live elsewhere
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  backgroundImage?: Media | string | null;
}

export function HeroSection({
  title,
  subtitle,
  ctaLabel,
  backgroundImage,
}: HeroSectionProps) {
  const imageUrl =
    backgroundImage && typeof backgroundImage === "object"
      ? backgroundImage.url
      : "/images/hero-team.png"; // fallback if no image set in Payload yet

  return (
    <section className="relative min-h-[500px] overflow-hidden py-24 lg:min-h-[600px] lg:py-32">
      <Image
        src={imageUrl ?? "/images/hero-team.png"}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-milk from-[40%] via-brand-milk/70 via-[55%] to-transparent to-[80%] lg:block" />
      <div className="absolute inset-0 bg-brand-milk/90 lg:hidden" />
      <div className="relative z-10 flex h-full max-w-7xl items-center px-6 lg:px-24 ">
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
            className="mt-8 bg-brand-green font-heading text-brand-milk hover:bg-brand-green/90 lg:mt-10 text-base lg:text-lg"
          >
            <Link href="#contact">{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
