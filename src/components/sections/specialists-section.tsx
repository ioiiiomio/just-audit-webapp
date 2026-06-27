import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import { SpecialistsGrid } from "./specialists-grid";

export async function SpecialistsSection({ locale }: { locale: string }) {
  const t = await getTranslations("specialists");
  const payload = await getPayload({ config });

  const teamMembersGlobal = await payload.findGlobal({
    slug: "team-members",
    locale: locale as "ru" | "kz",
    depth: 1, // resolves `photo` to the full Media doc
  });

  const members = teamMembersGlobal.items ?? [];

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

        <SpecialistsGrid featured={featured as any} rest={rest as any} />
      </div>
    </section>
  );
}
