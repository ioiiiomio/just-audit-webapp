import type { Certificate } from "@/payload-types";

export interface ResolvedCertificateImage {
  thumbnailUrl: string;
  fullUrl: string;
  isPdf: boolean;
}

export function resolveCertificateImage(
  cert: Certificate,
): ResolvedCertificateImage | null {
  const image = typeof cert.image === "object" ? cert.image : null;
  if (!image || !image.url) return null;

  if (image.mimeType === "application/pdf") {
    const thumb =
      typeof image.pdfThumbnail === "object" ? image.pdfThumbnail : null;
    if (!thumb?.url) return null; // hook hasn't run / failed — skip until it has a preview
    return { thumbnailUrl: thumb.url, fullUrl: image.url, isPdf: true };
  }

  return { thumbnailUrl: image.url, fullUrl: image.url, isPdf: false };
}
