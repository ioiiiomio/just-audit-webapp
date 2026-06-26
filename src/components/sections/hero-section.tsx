import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Image
        src="/images/hero-team.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Gradient: solid milk behind the text up top, fading to the photo lower down (desktop) */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-milk from-[40%] via-brand-milk/70 via-[55%] to-transparent to-[80%] lg:block" />

      {/* Solid milk panel behind the text on mobile, since there's no room for the gradient to do its job */}
      <div className="absolute inset-0 bg-brand-milk/90 lg:hidden" />

      <div className="relative z-10 flex h-full max-w-7xl items-center px-6 lg:px-24">
        <div className="max-w-lg">
          <h1 className="font-heading text-3xl font-bold uppercase leading-[1.2] text-brand-green lg:text-[3.25rem]">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-md font-body text-base text-brand-black/80 lg:mt-6 lg:text-lg">
            {t("subtitle")}
          </p>
          <Button
            size="lg"
            className="mt-8 bg-brand-green font-heading text-brand-milk hover:bg-brand-green/90 lg:mt-10"
          >
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
