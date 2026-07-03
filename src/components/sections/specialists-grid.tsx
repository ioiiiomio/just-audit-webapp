import Image from "next/image";
import { teamIcons } from "@/lib/team-icons";

type Highlight = {
  icon: string;
  text: string;
  id?: string;
};

type Member = {
  id?: string;
  name: string;
  position?: string;
  bio?: string;
  photo?: { url?: string } | string | null;
  linkedin?: string;
  featured?: boolean;
  highlights?: Highlight[];
};

export function SpecialistsGrid({
  featured,
  rest,
}: {
  featured: Member[];
  rest: Member[];
}) {
  return (
    <div className="mt-14 space-y-8 text-left">
      {featured.map((member, index) => {
        const id = member.id ?? `featured-${index}`;

        return (
          <div key={id} className="rounded-2xl bg-white p-10">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                {member.photo &&
                  typeof member.photo === "object" &&
                  member.photo.url && (
                    <Image
                      src={member.photo.url}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  )}
              </div>

              <div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-brand-green">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-label text-sm font-bold uppercase tracking-wide text-amber-700">
                    {member.position}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                    {member.highlights?.map((h, i) => {
                      const Icon = teamIcons[h.icon as keyof typeof teamIcons];
                      return (
                        <div
                          key={h.id ?? i}
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
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="grid gap-8 sm:grid-cols-2">
        {rest.map((member, index) => {
          const id = member.id ?? `rest-${index}`;

          return (
            <div key={id} className="flex gap-6 rounded-2xl bg-white p-8">
              <div className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-xl">
                {member.photo &&
                  typeof member.photo === "object" &&
                  member.photo.url && (
                    <Image
                      src={member.photo.url}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  )}
              </div>
              <div className="flex-1">
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-green">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-label text-xs font-bold uppercase tracking-wide text-amber-700">
                    {member.position}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="whitespace-pre-line font-body text-sm text-brand-milk/80">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
