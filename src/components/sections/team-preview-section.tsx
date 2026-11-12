import { getPayload } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";
import { Container } from "@/components/ui/container";
import { SpecialistsGrid } from "./specialists-grid";
import { TeamCarousel, type CarouselMember } from "./team-carousel";

type Locale = "ru" | "kz" | "en";

const HEADING_FALLBACK: Record<Locale, string> = {
    ru: "Наша команда",
    kz: "Біздің команда",
    en: "Team members",
};
const VIEW_ALL_FALLBACK: Record<Locale, string> = {
    ru: "вся команда",
    kz: "бүкіл команда",
    en: "whole team",
};
const HOMEPAGE_LIMIT = 12;

const mediaUrl = (m: number | Media | null | undefined) =>
    m && typeof m === "object" ? (m.url ?? null) : null;

export async function TeamPreviewSection({ locale }: { locale: string }) {
    const l = (["ru", "kz", "en"].includes(locale) ? locale : "ru") as Locale;
    const payload = await getPayload({ config });
    const team = await payload.findGlobal({ slug: "team-members", locale: l, depth: 1 });

    const members = team.items ?? [];
    const founder = members.find((m) => m.featured);
    const others = members.filter((m) => !m.featured);
    const picked = others.filter((m) => m.showOnHomepage);
    const notPicked = others.filter((m) => !m.showOnHomepage);

    const carouselMembers: CarouselMember[] = [...picked, ...notPicked]
        .slice(0, HOMEPAGE_LIMIT)
        .map((m, i) => ({
            id: m.id ?? `member-${i}`,
            name: m.name,
            position: m.position ?? "",
            bio: m.bio ?? "",
            photoUrl: mediaUrl(m.photo),
        }));

    return (
        <>
            {/* Founder */}
            <section id="team" className="bg-brand-milk py-20 lg:py-20">
                <Container className="text-center">
                    <h2 className="font-heading text-4xl font-bold text-brand-green sm:text-5xl">
                        {team.eyebrow}
                    </h2>
                    <div className="mx-auto mt-4 h-px w-12 bg-brand-green" />
                    <p className="mx-auto mt-6 max-w-2xl font-body text-brand-black/80">
                        {team.subtitle}
                    </p>
                    {founder && <SpecialistsGrid featured={[founder] as any} rest={[]} />}
                </Container>
            </section>

            {/* Carousel */}
            {carouselMembers.length > 0 && (
                <section className="overflow-x-clip bg-brand-milk py-20 lg:py-12">
                    <Container>
                        <TeamCarousel
                            heading={team.carouselHeading || HEADING_FALLBACK[l]}
                            members={carouselMembers}
                            viewAllHref={`/${l}/team`}
                            viewAllLabel={team.viewAllLabel || VIEW_ALL_FALLBACK[l]}
                        />
                    </Container>
                </section>
            )}
        </>
    );
}