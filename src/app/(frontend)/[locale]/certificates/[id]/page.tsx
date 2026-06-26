import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { PdfViewer } from "@/components/pdf-viewer";

export default async function CertificateViewerPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const payload = await getPayload({ config });
  const cert = await payload
    .findByID({ collection: "certificates", id, locale: locale as "ru" | "kz" })
    .catch(() => null);

  if (!cert) notFound();

  return (
    <div className="min-h-screen bg-black">
      <PdfViewer
        sourceUrl={`/api/certificates/${id}/source`}
        title={cert.title}
      />
    </div>
  );
}
