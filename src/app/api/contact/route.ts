// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.phone || !body.email) {
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
      email: body.email,
      company: body.company ?? "",
      comment: body.comment ?? "",
    },
  });

  return NextResponse.json({ ok: true });
}
