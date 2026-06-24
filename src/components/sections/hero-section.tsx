"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-[#F7F5F2] px-6 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Text block */}
        <div className="max-w-xl">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold uppercase leading-tight text-[#155335] lg:text-5xl">
            {t("headline")}
          </h1>
          <p className="mt-6 font-[var(--font-montserrat)] text-base text-[#1A1A1A]/80 lg:text-lg">
            {t("subtitle")}
          </p>
          <Button
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 rounded-full bg-[#155335] px-8 py-6 font-[var(--font-montserrat)] font-semibold text-white hover:bg-[#155335]/90"
          >
            {t("cta")}
          </Button>
        </div>

        {/* Image block */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/hero.jpg"
              alt={t("headline")}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Scroll-to-top button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="absolute bottom-0 right-0 flex h-16 w-16 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-[#155335] text-white shadow-lg ring-4 ring-[#F7F5F2] transition-transform hover:scale-105 lg:h-20 lg:w-20"
          >
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
