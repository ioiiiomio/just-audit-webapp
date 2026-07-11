// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";
import { checkFormRateLimit } from "@/lib/rate-limit";

const COOLDOWN_SECONDS = 60;
const COOKIE_NAME = "contact_last_submit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { success } = await checkFormRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 },
    );
  }

  const cookieStore = await cookies();
  const lastSubmit = cookieStore.get(COOKIE_NAME)?.value;

  if (lastSubmit) {
    const secondsSince = (Date.now() - Number(lastSubmit)) / 1000;
    if (secondsSince < COOLDOWN_SECONDS) {
      return NextResponse.json(
        {
          error: `Подождите ${Math.ceil(
            COOLDOWN_SECONDS - secondsSince,
          )} сек. перед повторной отправкой`,
        },
        { status: 429 },
      );
    }
  }

  const body = await req.json();

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
      type: "contact",
      name: body.name,
      phone: body.phone,
      email: body.email,
      company: body.company,
      comment: body.comment,
    },
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, Date.now().toString(), {
    httpOnly: true,
    maxAge: COOLDOWN_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
