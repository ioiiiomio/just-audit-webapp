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

function MemberPhoto({ member, sizes }: { member: Member; sizes: string }) {
  if (!member.photo || typeof member.photo !== "object" || !member.photo.url) {
    return null;
  }
  return (
    <Image
      src={member.photo.url}
      alt={member.name}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

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
          <div key={id} className="rounded-2xl bg-white p-6 sm:p-8 lg:p-10">
            {/*
              Mobile / tablet:      Desktop (lg+):
              [photo][name    ]     [photo][name      ]
              [highlights     ]     [photo][highlights]
            */}
            <div className="grid grid-cols-[6rem_1fr] gap-x-5 gap-y-6 sm:grid-cols-[8rem_1fr] sm:gap-x-6 sm:gap-y-8 lg:grid-cols-[280px_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl lg:row-span-2">
                <MemberPhoto member={member} sizes="(min-width: 1024px) 280px, 128px" />
              </div>

              <div className="self-center lg:self-start">
                <h3 className="font-heading text-xl font-bold text-brand-green sm:text-2xl">
                  {member.name}
                </h3>
                {member.position && (
                  <p className="mt-1 font-label text-xs font-bold uppercase tracking-wide text-amber-700 sm:text-sm">
                    {member.position}
                  </p>
                )}
              </div>

              {member.highlights && member.highlights.length > 0 && (
                <div className="col-span-2 lg:col-span-1">
                  <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                    {member.highlights.map((h, i) => {
                      const Icon = teamIcons[h.icon as keyof typeof teamIcons];
                      return (
                        <div
                          key={h.id ?? i}
                          className="flex gap-4 border-t border-brand-black/10 pt-6 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 sm:size-12">
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
              )}
            </div>
          </div>
        );
      })}

      <div className="grid gap-8 sm:grid-cols-2">
        {rest.map((member, index) => {
          const id = member.id ?? `rest-${index}`;

          return (
            <div
              key={id}
              className="flex gap-5 rounded-2xl bg-white p-6 sm:gap-6 sm:p-8"
            >
              {/* Small photo beside the text on every screen size (was full-width on mobile) */}
              <div className="relative aspect-[4/5] w-20 shrink-0 self-start overflow-hidden rounded-xl sm:w-28">
                <MemberPhoto member={member} sizes="112px" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-lg font-bold text-brand-green">
                  {member.name}
                </h3>
                {member.position && (
                  <p className="mt-1 font-label text-xs font-bold uppercase tracking-wide text-amber-700">
                    {member.position}
                  </p>
                )}
                {member.bio && (
                  <p className="mt-4 whitespace-pre-line font-body text-sm text-brand-black">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
