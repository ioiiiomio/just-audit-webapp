// components/navbar-client.tsx
"use client";

import { useState } from "react";
import Link from "next/link"; // or your locale-aware Link, for the other nav items
import Image from "next/image";
import { ConsultationModal } from "@/components/consultation-modal";

interface NavItem {
    id: string;
    label: string;
    href: string;
    type: string;
}

interface NavbarClientProps {
    navItems: NavItem[];
    logoUrl: string;
    ctaLabel: string;
    ctaHref: string; // no longer used for navigation, kept for fallback/analytics if needed
}

export function NavbarClient({ navItems, logoUrl, ctaLabel }: NavbarClientProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <nav className="flex items-center justify-between px-6 py-4 lg:px-16">
                <Image src={logoUrl} alt="Logo" width={140} height={40} />

                <div className="hidden items-center gap-8 lg:flex">
                    {navItems.map((item) => (
                        <Link key={item.id} href={item.href} className="text-sm font-medium">
                            {item.label}
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-[#1F3A2E] px-5 py-3 text-sm font-medium text-white hover:bg-[#1F3A2E]/90"
                >
                    {ctaLabel}
                </button>
            </nav>

            <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} title={ctaLabel} />
        </>
    );
}