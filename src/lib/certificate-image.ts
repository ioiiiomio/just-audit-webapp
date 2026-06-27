import type { Certificate } from "@/payload-types";

export interface ResolvedCertificateImage {
  url: string;
  isPdf: boolean;
}

export function resolveCertificateImage(
  cert: Certificate,
): ResolvedCertificateImage | null {
  const image = typeof cert.image === "object" ? cert.image : null;
  if (!image || !image.url) return null;

  return {
    url: image.url,
    isPdf: image.mimeType === "application/pdf",
  };
}
