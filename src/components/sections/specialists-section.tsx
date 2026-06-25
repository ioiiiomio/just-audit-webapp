// src/components/sections/specialists-section.tsx
import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import { teamIcons } from "@/lib/team-icons";
import { getTranslations } from "next-intl/server";

export async function SpecialistsSection({ locale }: { locale: string }) {
  const t = await getTranslations("specialists");
  const payload = await getPayload({ config });

  const { docs: members } = await payload.find({
    collection: "team-members",
    locale: locale as "ru" | "kz",
    sort: "-featured",
  });

  const featured = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  return (
    <section id="team" className="bg-brand-beige px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-heading text-4xl font-bold text-brand-green sm:text-5xl">
          {t("title")}
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-brand-green" />
        <p className="mx-auto mt-6 max-w-2xl font-body text-brand-black/80">
          {t("subtitle")}
        </p>

        <div className="mt-14 space-y-8 text-left">
          {featured.map((member) => (
            <div
              key={member.id}
              className="grid gap-10 rounded-2xl bg-white p-10 lg:grid-cols-[280px_1fr]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src={member.photo?.url}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-brand-green">
                  {member.name}
                </h3>
                <p className="mt-1 font-label text-sm font-bold uppercase tracking-wide text-amber-700">
                  {member.role}
                </p>

                <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {member.highlights?.map(
                    (h: { icon: string; text: string }, i: number) => {
                      const Icon = teamIcons[h.icon as keyof typeof teamIcons];
                      return (
                        <div
                          key={i}
                          className="flex gap-4 border-t border-brand-black/10 pt-6 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
                        >
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                            {Icon && (
                              <Icon className="size-5 text-brand-green" />
                            )}
                          </div>
                          <p className="font-body text-sm text-brand-black/80">
                            {h.text}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="grid gap-8 sm:grid-cols-2">
            {rest.map((member) => (
              <div
                key={member.id}
                className="flex gap-6 rounded-2xl bg-white p-8"
              >
                <div className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={member.photo?.url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-green">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-label text-xs font-bold uppercase tracking-wide text-amber-700">
                    {member.role}
                  </p>
                  <p className="mt-4 font-body text-sm text-brand-black/80">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
