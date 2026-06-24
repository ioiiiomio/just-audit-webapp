"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation"; // next-intl navigation wrapper
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    // Only intercept when we're already on the home page; otherwise let the
    // browser navigate to "/" + hash naturally.
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#155335] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-[var(--font-playfair)] leading-tight">
          <span className="block text-lg tracking-wide">JUST</span>
          <span className="block text-lg tracking-wide">AUDIT</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 font-[var(--font-montserrat)] text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.type === "anchor" ? (
                <Link
                  href={`/${item.href}`}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="transition-opacity hover:opacity-80"
                >
                  {t(item.label)}
                </Link>
              ) : (
                <Link
                  href={item.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {t(item.label)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Locale switch + CTA */}
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
          </div>

          <Button
            asChild
            className="rounded-full bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/20"
          >
            <Link
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
            >
              {t("nav.cta")}
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-4 bg-[#155335] px-6 pb-6 lg:hidden">
          {navItems.map((item) =>
            item.type === "anchor" ? (
              <Link
                key={item.label}
                href={`/${item.href}`}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="font-[var(--font-montserrat)] font-semibold"
              >
                {t(item.label)}
              </Link>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="font-[var(--font-montserrat)] font-semibold"
                onClick={() => setOpen(false)}
              >
                {t(item.label)}
              </Link>
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
          </div>
          <Button
            asChild
            className="rounded-full bg-white/10 text-white ring-1 ring-white/40"
          >
            <Link
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
            >
              {t("nav.cta")}
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
