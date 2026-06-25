// src/components/sections/HeroSection.tsx
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative bg-brand-milk">
      {/* Desktop / tablet: full-bleed image with text in the gradient zone */}
      <div className="relative hidden min-h-[620px] w-full lg:block lg:min-h-[760px]">
        <Image
          src="/images/hero-team.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 flex h-full max-w-7xl items-center px-10 lg:px-16">
          <div className="max-w-lg">
            <h1 className="font-heading text-4xl font-bold uppercase leading-[1.2] text-brand-green lg:text-[3.25rem]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-md font-body text-lg text-brand-black/80">
              {t("subtitle")}
            </p>
            <Button
              size="lg"
              className="mt-10 bg-brand-green font-heading text-brand-milk hover:bg-brand-green/90"
            >
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: text on flat milk background, image stacked below */}
      <div className="px-6 py-16 lg:hidden">
        <h1 className="font-heading text-3xl font-bold uppercase leading-[1.2] text-brand-green">
          {t("title")}
        </h1>
        <p className="mt-5 font-body text-base text-brand-black/80">
          {t("subtitle")}
        </p>
        <Button
          size="lg"
          className="mt-8 bg-brand-green font-heading text-brand-milk hover:bg-brand-green/90"
        >
          {t("cta")}
        </Button>
      </div>
      <div className="relative aspect-[4/3] w-full lg:hidden">
        <Image
          src="/images/hero-team.jpg"
          alt=""
          fill
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
