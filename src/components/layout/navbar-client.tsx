"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function NavbarClient({
  navItems,
  logoUrl,
  ctaLabel,
  ctaHref,
}: NavbarClientProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) smoothScrollTo(el, 900); // duration in ms — tweak to taste
      setOpen(false);
    }
  };

  const renderLink = (
    item: NavItem,
    className: string,
    onClick?: () => void,
  ) => (
    <Link
      key={item.id}
      href={item.type === "anchor" ? `/${item.href}` : item.href}
      onClick={(e) => {
        if (item.type === "anchor") handleAnchorClick(e, item.href);
        onClick?.();
      }}
      className={className}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F2] text-[#155335] lg:bg-[#F7F5F2]/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl}
            alt="Just Audit"
            width={80}
            height={20}
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 font-[family-name:var(--font-montserrat)] text-medium font-semibold lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              {renderLink(item, "transition-opacity hover:opacity-80")}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Link
              href={pathname}
              locale="ru"
              className={cn("px-1", locale === "ru" && "underline")}
            >
              RU
            </Link>
            <span>|</span>
            <Link
              href={pathname}
              locale="kz"
              className={cn("px-1", locale === "kz" && "underline")}
            >
              KZ
            </Link>
            <span>|</span>
            <Link
              href={pathname}
              locale="en"
              className={cn("px-1", locale === "en" && "underline")}
            >
              EN
            </Link>
          </div>

          <Button
            asChild
            className="rounded-l bg-[#155335] text-white hover:bg-[#155335]/90"
          >
            <Link
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
            >
              {ctaLabel}
            </Link>
          </Button>
        </div>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 bg-[#F7F5F2] px-6 pb-6 lg:hidden">
          {navItems.map((item) =>
            renderLink(
              item,
              "font-[family-name:var(--font-montserrat)] font-semibold",
              () => setOpen(false),
            ),
          )}
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Link href={pathname} locale="ru">
              RU
            </Link>
            <span>|</span>
            <Link href={pathname} locale="kz">
              KZ
            </Link>
            <span>|</span>
            <Link href={pathname} locale="en">
              EN
            </Link>
          </div>
          <Button
            asChild
            className="rounded-l bg-[#155335] text-white hover:bg-[#155335]/90"
          >
            <Link
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
            >
              {ctaLabel}
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
