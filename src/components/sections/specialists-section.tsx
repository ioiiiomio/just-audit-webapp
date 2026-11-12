import { getPayload } from "payload";
import config from "@payload-config";
import { SpecialistsGrid } from "./specialists-grid";
import { Container } from "@/components/ui/container";

interface SpecialistsSectionProps {
  locale: string;
  /** Heading level: h1 on the /team page, h2 when embedded in another page */
  as?: "h1" | "h2";
}

export async function SpecialistsSection({
                                           locale,
                                           as: Heading = "h2",
                                         }: SpecialistsSectionProps) {
  const payload = await getPayload({ config });
  const teamMembersGlobal = await payload.findGlobal({
    slug: "team-members",
    locale: locale as "ru" | "kz" | "en",
    depth: 1, // resolves `photo` to the full Media doc
  });

  const members = teamMembersGlobal.items ?? [];
  const featured = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  return (
      <section id="team" className="bg-brand-milk py-20 lg:py-28">
        <Container className="text-center">
          <Heading className="font-heading text-4xl font-bold text-brand-green sm:text-5xl">
            {teamMembersGlobal.eyebrow}
          </Heading>
          <div className="mx-auto mt-4 h-px w-12 bg-brand-green" />
          <p className="mx-auto mt-6 max-w-2xl font-body text-brand-black/80">
            {teamMembersGlobal.subtitle}
          </p>
          <SpecialistsGrid featured={featured as any} rest={rest as any} />
        </Container>
      </section>
  );
}