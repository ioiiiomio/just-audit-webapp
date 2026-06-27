import * as LucideIcons from "lucide-react";
import { HelpCircle, type LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? HelpCircle; // fallback if the editor types a name that doesn't exist
}

interface Principle {
  icon: string;
  title: string;
  description: string;
}

interface AboutSectionProps {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2?: string | null;
  paragraph3?: string | null;
  principlesEyebrow: string;
  principles: Principle[];
}

export function AboutSection({
  eyebrow,
  title,
  paragraph1,
  paragraph2,
  paragraph3,
  principlesEyebrow,
  principles,
}: AboutSectionProps) {
  return (
    <section id="about" className="bg-brand-milk px-6 py-20 lg:px-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-brand-green">
            {title}
          </h2>
          <div className="mt-6 space-y-5 font-body text-brand-black/80">
            <p>{paragraph1}</p>
            {paragraph2 && <p>{paragraph2}</p>}
            {paragraph3 && <p>{paragraph3}</p>}
          </div>
        </div>
        <div className="lg:border-l lg:border-brand-black/10 lg:pl-16">
          <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
            {principlesEyebrow}
          </span>
          <ul className="mt-6 divide-y divide-brand-black/10">
            {principles.map((principle, i) => {
              const Icon = getIcon(principle.icon);
              return (
                <li key={i} className="flex gap-6 py-8 first:pt-0 last:pb-0">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                    <Icon className="size-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-brand-green">
                      {principle.title}
                    </h3>
                    <p className="mt-2 font-body text-brand-black/80">
                      {principle.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
