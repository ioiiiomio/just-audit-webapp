import { getPayload } from "payload";
import config from "@payload-config";
import { AnnouncementBannerClient } from "./announcement-banner-client";
import {
    AnnouncementModal,
    type AnnouncementType,
    type Localized,
    type ModalAnnouncement,
} from "./announcement-modal";

type Locale = "ru" | "kz" | "en";
type LocalizedValue = Localized | null | undefined;

type RawAnnouncement = {
    id: number;
    updatedAt: string;
    type: AnnouncementType;
    display?: "banner" | "modal" | null;
    title: LocalizedValue;
    message?: LocalizedValue;
    buttonLabel?: LocalizedValue;
    link?: { label?: LocalizedValue; href?: string | null } | null;
    contact?: {
        name?: LocalizedValue;
        note?: LocalizedValue;
        phone?: string | null;
        email?: string | null;
    } | null;
};

// current locale → Russian fallback
const pick = (v: LocalizedValue, l: Locale) => v?.[l] || v?.ru || null;

export async function AnnouncementsBanner({ locale }: { locale: string }) {
    const l = (["ru", "kz", "en"].includes(locale) ? locale : "ru") as Locale;
    const payload = await getPayload({ config });
    const now = new Date().toISOString();

    const { docs } = await payload.find({
        collection: "announcements",
        locale: "all", // all languages at once, for the popup's tabs
        where: {
            isActive: { equals: true },
            and: [
                {
                    or: [
                        { startDate: { less_than_equal: now } },
                        { startDate: { exists: false } },
                    ],
                },
                {
                    or: [
                        { endDate: { greater_than_equal: now } },
                        { endDate: { exists: false } },
                    ],
                },
            ],
        },
        sort: "-priority",
        limit: 10,
    });

    const raw = docs as unknown as RawAnnouncement[];

    const banners = raw
        .filter((d) => (d.display ?? "banner") === "banner")
        .map((d) => ({
            id: d.id,
            type: d.type,
            title: pick(d.title, l) ?? "",
            message: pick(d.message, l),
            link: d.link?.href
                ? { href: d.link.href, label: pick(d.link.label, l) }
                : null,
        }));

    const modalDoc = raw.find((d) => d.display === "modal");
    const modal: ModalAnnouncement | null = modalDoc
        ? {
            // updatedAt in the key → editing the announcement shows it again
            key: `${modalDoc.id}:${modalDoc.updatedAt}`,
            type: modalDoc.type,
            title: modalDoc.title ?? {},
            message: modalDoc.message ?? {},
            buttonLabel: modalDoc.buttonLabel ?? {},
            linkHref: modalDoc.link?.href || null,
            contact: modalDoc.contact
                ? {
                    name: modalDoc.contact.name ?? {},
                    note: modalDoc.contact.note ?? {},
                    phone: modalDoc.contact.phone || null,
                    email: modalDoc.contact.email || null,
                }
                : null,
        }
        : null;

    if (banners.length === 0 && !modal) return null;

    return (
        <>
            {banners.length > 0 && <AnnouncementBannerClient announcements={banners} />}
            {modal && <AnnouncementModal announcement={modal} initialLocale={l} />}
        </>
    );
}