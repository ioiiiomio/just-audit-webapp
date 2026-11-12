import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { HelpCircle, type LucideIcon } from "lucide-react";
import type { Media } from "@/payload-types";
import { Container } from "@/components/ui/container";

function getIcon(name: string): LucideIcon {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? HelpCircle;
}

interface TrustPoint {
  icon: string;
  title: string;
  description: string;
}

interface WhyUsSectionProps {
  eyebrow: string;
  title: string;
  backgroundImage?: Media | number | string | null;
  points: TrustPoint[];
}

export function WhyUsSection({
  eyebrow,
  title,
  backgroundImage,
  points,
}: WhyUsSectionProps) {
  const imageUrl =
    backgroundImage && typeof backgroundImage === "object"
      ? backgroundImage.url
      : "/images/why-us-bg.png";

  return (
    <section id="why-us" className="relative overflow-hidden py-20 lg:py-28">
      <Image
        src={imageUrl ?? "/images/why-us-bg.png"}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
            {title}
          </h2>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {points.map((point, index) => {
            const Icon = getIcon(point.icon);
            return (
              <div
                key={index}
                className="w-full rounded-2xl bg-white p-8 text-center shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Icon
                  className="mx-auto size-9 text-brand-green"
                  strokeWidth={1.5}
                />
                <h3 className="mt-5 font-heading text-lg font-bold text-brand-green">
                  {point.title}
                </h3>
                <p className="mt-3 font-body text-sm text-brand-black/80">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
