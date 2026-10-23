"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type CarouselMember = {
    id: string;
    name: string;
    position: string;
    bio: string;
    photoUrl: string | null;
};

const GAP = 16; // matches gap-4 on the track

export function TeamCarousel({
                                 heading,
                                 members,
                                 viewAllHref,
                                 viewAllLabel,
                             }: {
    heading: string;
    members: CarouselMember[];
    viewAllHref: string;
    viewAllLabel: string;
}) {
    const trackRef = useRef<HTMLUListElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, [updateArrows]);

    const scroll = (dir: -1 | 1) => {
        const el = trackRef.current;
        const card = el?.querySelector<HTMLElement>("li");
        if (!el || !card) return;
        el.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: "smooth" });
    };

    return (
        <div>
            {/* Header: centered heading, link on the right */}
            <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
                <div className="hidden md:block" aria-hidden />

                <h2 className="text-center font-heading text-3xl font-bold text-brand-green sm:text-4xl">
                    {heading}
                </h2>

                <Link
                    href={viewAllHref}
                    className="group inline-flex items-center gap-3 font-body text-sm text-brand-black transition-colors hover:text-brand-green md:justify-self-end"
                >
                    {viewAllLabel}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="mt-12 flex items-center gap-4">
                <NavButton dir="prev" disabled={!canPrev} onClick={() => scroll(-1)} />

                <ul
                    ref={trackRef}
                    className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {members.map((m) => (
                        <li
                            key={m.id}
                            className="shrink-0 basis-[85%] snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
                        >
                            <article className="group flex h-full flex-col rounded-xl border border-brand-black/10 bg-white p-5 transition-shadow duration-300 hover:shadow-lg">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-brand-beige">
                                    {m.photoUrl && (
                                        <Image
                                            src={m.photoUrl}
                                            alt={m.name}
                                            fill
                                            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 85vw"
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    )}
                                </div>

                                <div className="mt-5 flex flex-1 flex-col">
                                    <h3 className="font-heading text-xl font-bold text-brand-green">
                                        {m.name}
                                    </h3>
                                    {m.position && (
                                        <p className="mt-1 font-label text-xs font-bold uppercase tracking-wide text-amber-700">
                                            {m.position}
                                        </p>
                                    )}
                                    {m.bio && (
                                        <p className="mt-3 line-clamp-3 whitespace-pre-line font-body text-sm text-brand-black/70">
                                            {m.bio}
                                        </p>
                                    )}
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>

                <NavButton dir="next" disabled={!canNext} onClick={() => scroll(1)} />
            </div>
        </div>
    );
}

function NavButton({
                       dir,
                       disabled,
                       onClick,
                   }: {
    dir: "prev" | "next";
    disabled: boolean;
    onClick: () => void;
}) {
    const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
    return (
        <button
            type="button"
            aria-label={dir === "prev" ? "Previous" : "Next"}
            disabled={disabled}
            onClick={onClick}
            className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-brand-black/15 bg-white/60 text-brand-black transition-colors hover:border-brand-green hover:bg-brand-green hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex"
        >
            <Icon className="size-4" />
        </button>
    );
}