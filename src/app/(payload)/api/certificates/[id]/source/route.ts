// src/app/(payload)/api/certificates/[id]/source/route.ts
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await getPayload({ config });

  const cert = await payload
    .findByID({ collection: "certificates", id, depth: 1 })
    .catch(() => null);

  if (!cert) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404 },
    );
  }

  const mediaDoc =
    typeof cert.image === "object"
      ? cert.image
      : await payload
          .findByID({ collection: "media", id: cert.image })
          .catch(() => null);

  if (!mediaDoc?.url) {
    return NextResponse.json(
      { error: "Source file not found" },
      { status: 404 },
    );
  }

  return NextResponse.redirect(new URL(mediaDoc.url, req.url));
}
