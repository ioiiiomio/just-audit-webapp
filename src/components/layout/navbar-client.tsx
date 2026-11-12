"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { smoothScrollTo } from "@/lib/smooth-scroll";

type NavItem = {
  id: string | number;
  label: string;
  href: string;
  type: "anchor" | "route";
};

interface NavbarClientProps {
  navItems: NavItem[];
  logoUrl: string;
  ctaLabel: string;
  ctaHref: string;
}

const LOCALES = [
  { code: "ru", label: "RU" },
  { code: "kz", label: "KZ" },
  { code: "en", label: "EN" },
] as const;

export function NavbarClient({
  navItems,
  logoUrl,
  ctaLabel,
  ctaHref,
}: NavbarClientProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // "#contact" → "/#contact" so the CTA also works from non-home pages
  const ctaIsAnchor = ctaHref.startsWith("#");
  const ctaLinkHref = ctaIsAnchor ? `/${ctaHref}` : ctaHref;

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) smoothScrollTo(el, 900); // duration in ms — tweak to taste
    }
    setOpen(false);
  };

  const renderLink = (item: NavItem, className: string) => (
    <Link
      key={item.id}
      href={item.type === "anchor" ? `/${item.href}` : item.href}
      onClick={(e) => {
        if (item.type === "anchor") handleAnchorClick(e, item.href);
        else setOpen(false);
      }}
      className={className}
    >
      {item.label}
    </Link>
  );

  const localeSwitcher = (
    <div className="flex items-center gap-1 text-sm font-semibold">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">|</span>}
          <Link
            href={pathname}
            locale={code}
            className={cn("px-1", locale === code && "underline underline-offset-4")}
            aria-current={locale === code ? "true" : undefined}
          >
            {label}
          </Link>
        </span>
      ))}
    </div>
  );

  const ctaButton = (
    <Button
      asChild
      className="rounded-l bg-brand-green text-white hover:bg-brand-green/90"
    >
      <Link
        href={ctaLinkHref}
        onClick={(e) => {
          if (ctaIsAnchor) handleAnchorClick(e, ctaHref);
        }}
      >
        {ctaLabel}
      </Link>
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 bg-brand-milk text-brand-green lg:bg-brand-milk/70 lg:backdrop-blur">
      <nav>
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Image
              src={logoUrl}
              alt="Just Audit"
              width={120}
              height={40}
              priority
            />
          </Link>

          <ul className="hidden items-center gap-5 font-[family-name:var(--font-montserrat)] text-sm font-semibold lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                {renderLink(item, "transition-opacity hover:opacity-80")}
              </li>
            ))}
          </ul>

          <div className="ml-3 hidden items-center gap-4 lg:flex">
            {localeSwitcher}
            {ctaButton}
          </div>

          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </Container>
      </nav>

      {open && (
        <Container className="flex flex-col gap-4 bg-brand-milk pb-6 lg:hidden">
          {navItems.map((item) =>
            renderLink(
              item,
              "font-[family-name:var(--font-montserrat)] font-semibold",
            ),
          )}
          {localeSwitcher}
          {ctaButton}
        </Container>
      )}
    </header>
  );
}
