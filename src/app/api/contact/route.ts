// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const payload = await getPayload({ config });

  await payload.create({
    collection: "submissions",
    data: {
      name: body.name,
      phone: body.phone,
      company: body.company ?? "",
      comment: body.comment ?? "",
    },
  });

  return NextResponse.json({ ok: true });
}
