import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PdfViewer } from "@/components/pdf-viewer";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ id: string; locale: Locale }> };

// Shared by generateMetadata and the page: one DB call per request
const getCertificate = cache(async (id: string, locale: Locale) => {
    const payload = await getPayload({ config });
    return payload
        .findByID({ collection: "certificates", id, locale, depth: 0 })
        .catch(() => null);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params;
    const cert = await getCertificate(id, locale);
    if (!cert) return {};
    return {
        title: cert.title || undefined,
        // Viewer page has no indexable content; keep it out of search,
        // but let crawlers follow links from it
        robots: { index: false, follow: true },
    };
}

export default async function CertificateViewerPage({ params }: Props) {
    const { id, locale } = await params;
    const cert = await getCertificate(id, locale);
    if (!cert) notFound();

    return (
        <div className="min-h-screen bg-black">
            <PdfViewer
                sourceUrl={`/api/certificates/${id}/source`}
                title={cert.title ?? ""}
            />
        </div>
    );
}