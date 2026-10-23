"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Mail,
    Phone,
    UserRound,
    X,
} from "lucide-react";

type Locale = "ru" | "kz" | "en";
export type Localized = Partial<Record<Locale, string | null>>;
export type AnnouncementType = "info" | "maintenance" | "success" | "warning";

export type ModalAnnouncement = {
    key: string;
    type: AnnouncementType;
    title: Localized;
    message: Localized;
    buttonLabel: Localized;
    linkHref: string | null;
    contact: {
        name: Localized;
        note: Localized;
        phone: string | null;
        email: string | null;
    } | null;
};

const LOCALES: { code: Locale; label: string }[] = [
    { code: "ru", label: "РУС" },
    { code: "kz", label: "ҚАЗ" },
    { code: "en", label: "ENG" },
];

const UI: Record<Locale, { contact: string; ok: string; close: string }> = {
    ru: { contact: "Для связи:", ok: "Понятно", close: "Закрыть" },
    kz: { contact: "Байланыс үшін:", ok: "Түсінікті", close: "Жабу" },
    en: { contact: "Contact:", ok: "Got it", close: "Close" },
};

const TYPE_STYLES: Record<AnnouncementType, { icon: typeof Info; wrap: string }> = {
    info: { icon: Info, wrap: "bg-brand-green/10 text-brand-green" },
    maintenance: { icon: AlertTriangle, wrap: "bg-amber-100 text-amber-600" },
    success: { icon: CheckCircle2, wrap: "bg-brand-green/10 text-brand-green" },
    warning: { icon: AlertTriangle, wrap: "bg-red-100 text-red-600" },
};

const STORAGE_KEY = "dismissed-announcement-modals";

function readDismissed(): string[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function AnnouncementModal({
                                      announcement,
                                      initialLocale,
                                  }: {
    announcement: ModalAnnouncement;
    initialLocale: Locale;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [lang, setLang] = useState<Locale>(initialLocale);

    // Open on mount unless this exact version was already dismissed
    useEffect(() => {
        if (readDismissed().includes(announcement.key)) return;
        dialogRef.current?.showModal();
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [announcement.key]);

    // Fires on Esc, close button, backdrop click and main button
    const handleClose = () => {
        document.documentElement.style.overflow = "";
        try {
            const next = Array.from(new Set([...readDismissed(), announcement.key])).slice(-20);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // storage blocked (private mode) — popup will just show again next visit
        }
    };

    const close = () => dialogRef.current?.close();

    const t = (v: Localized) => v[lang] || v.ru || v.kz || v.en || "";
    const ui = UI[lang];
    const { icon: Icon, wrap } = TYPE_STYLES[announcement.type];

    const title = t(announcement.title);
    const message = t(announcement.message);
    const buttonLabel = t(announcement.buttonLabel) || ui.ok;

    const c = announcement.contact;
    const contactName = c ? t(c.name) : "";
    const contactNote = c ? t(c.note) : "";
    const hasContact = Boolean(c && (contactName || c.phone || c.email));

    const buttonClass =
        "flex w-full items-center justify-center rounded-2xl bg-brand-green px-6 py-4 font-body text-lg font-semibold text-white transition-colors hover:bg-brand-green/90";

    return (
        <dialog
            ref={dialogRef}
            onClose={handleClose}
            onClick={(e) => {
                if (e.target === dialogRef.current) close(); // click on backdrop
            }}
            aria-labelledby="announcement-modal-title"
            lang={lang === "kz" ? "kk" : lang}
            className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border-0 bg-[#FAF8F5] p-0 text-brand-black shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
        >
            <div className="p-6 sm:p-10">
                {/* Language tabs + close */}
                <div className="flex items-start justify-between gap-4">
                    <div role="tablist" aria-label="Language" className="flex gap-2">
                        {LOCALES.map(({ code, label }) => (
                            <button
                                key={code}
                                type="button"
                                role="tab"
                                aria-selected={lang === code}
                                onClick={() => setLang(code)}
                                className={`rounded-xl px-4 py-2 font-label text-sm font-bold transition-colors ${
                                    lang === code
                                        ? "bg-brand-green text-white"
                                        : "bg-brand-black/5 text-brand-green hover:bg-brand-black/10"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        aria-label={ui.close}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-black/5 text-brand-black transition-colors hover:bg-brand-black/10"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Icon, title, message */}
                <div className="mt-6 flex flex-col items-center text-center">
                    <div className={`flex size-20 items-center justify-center rounded-full ${wrap}`}>
                        <Icon className="size-9" />
                    </div>
                    <h2
                        id="announcement-modal-title"
                        className="mt-6 font-heading text-3xl font-bold text-brand-green sm:text-4xl"
                    >
                        {title}
                    </h2>
                    {message && (
                        <p className="mt-4 max-w-md whitespace-pre-line font-body text-brand-black/80">
                            {message}
                        </p>
                    )}
                </div>

                {/* Contact card */}
                {hasContact && c && (
                    <div className="mt-8 flex gap-6 rounded-2xl bg-brand-black/[0.04] p-6">
                        <div className="hidden items-center self-stretch border-r border-brand-black/10 pr-6 sm:flex">
                            <div className="flex size-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                                <UserRound className="size-6" />
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                            <p className="font-label text-xs uppercase tracking-widest text-brand-black/60">
                                {ui.contact}
                            </p>
                            {contactName && (
                                <p className="mt-2 font-heading text-2xl font-bold text-brand-green">
                                    {contactName}
                                </p>
                            )}
                            {contactNote && (
                                <p className="mt-2 whitespace-pre-line font-body text-sm text-brand-black/70">
                                    {contactNote}
                                </p>
                            )}

                            {(c.phone || c.email) && (
                                <div className="mt-4 space-y-3">
                                    {c.phone && (
                                        <a
                                            href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                                            className="flex items-center gap-4 font-body font-semibold text-brand-green hover:underline"
                                        >
                                            <Phone className="size-5 shrink-0" />
                                            {c.phone}
                                        </a>
                                    )}
                                    {c.email && (
                                        <a
                                            href={`mailto:${c.email}`}
                                            className="flex items-center gap-4 break-all font-body font-semibold text-brand-green hover:underline"
                                        >
                                            <Mail className="size-5 shrink-0" />
                                            {c.email}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main action */}
                <div className="mt-8 border-t border-brand-black/10 pt-6">
                    {announcement.linkHref ? (
                        <Link href={announcement.linkHref} onClick={close} className={buttonClass}>
                            {buttonLabel}
                        </Link>
                    ) : (
                        <button type="button" onClick={close} className={buttonClass}>
                            {buttonLabel}
                        </button>
                    )}
                </div>
            </div>
        </dialog>
    );
}