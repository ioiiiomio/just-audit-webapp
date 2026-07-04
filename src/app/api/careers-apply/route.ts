import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = ["application/pdf"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

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

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    const validationMessage =
      error?.data?.errors?.[0]?.message ?? error?.message ?? "Ошибка отправки";
    return NextResponse.json({ error: validationMessage }, { status: 400 });
  }
}
