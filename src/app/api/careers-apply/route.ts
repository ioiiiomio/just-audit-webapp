import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";

import { formRateLimit } from "@/lib/rate-limit";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = ["application/pdf"];
const COOLDOWN_SECONDS = 60;
const COOKIE_NAME = "careers_last_submit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { success } = await formRateLimit.limit(ip);

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
          error: `Подождите ${Math.ceil(COOLDOWN_SECONDS - secondsSince)} сек. перед повторной отправкой`,
        },
        { status: 429 },
      );
    }
  }

  try {
    const formData = await req.formData();

    const honeypot = formData.get("website")?.toString();
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const position = formData.get("position")?.toString().trim();
    const comment = formData.get("comment")?.toString().trim();
    const resumeFile = formData.get("resume") as File | null;

    if (!name || !phone || !email || !position) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    let resumeId: number | undefined;

    if (resumeFile && resumeFile.size > 0) {
      if (!ALLOWED_RESUME_TYPES.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: "Резюме должно быть в формате PDF" },
          { status: 400 },
        );
      }
      if (resumeFile.size > MAX_RESUME_BYTES) {
        return NextResponse.json(
          { error: "Файл резюме превышает 5MB" },
          { status: 400 },
        );
      }

      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const mediaDoc = await payload.create({
        collection: "media",
        data: { alt: `Резюме — ${name}` },
        file: {
          data: buffer,
          mimetype: resumeFile.type,
          name: resumeFile.name,
          size: resumeFile.size,
        },
      });

      resumeId = Number(mediaDoc.id);
    }

    const submission = await payload.create({
      collection: "submissions",
      data: {
        type: "career",
        name,
        phone,
        email,
        city,
        position,
        comment,
        resume: resumeId,
      },
    });
    const response = NextResponse.json({ success: true, id: submission.id });
    response.cookies.set(COOKIE_NAME, Date.now().toString(), {
      httpOnly: true,
      maxAge: COOLDOWN_SECONDS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error: any) {
    const validationMessage =
      error?.data?.errors?.[0]?.message ?? error?.message ?? "Ошибка отправки";
    return NextResponse.json({ error: validationMessage }, { status: 400 });
  }
}
