import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import type { CollectionConfig, CollectionBeforeChangeHook } from "payload";

const execFileAsync = promisify(execFile);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const generatePdfThumbnail: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  const file = req.file;

  // Only act on actual PDF uploads. The thumbnail we create below is a PNG,
  // so this same hook running on that create() call is a no-op (mimetype check fails).
  if (!file || file.mimetype !== "application/pdf") return data;

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-thumb-"));
  const pdfPath = path.join(tmpDir, "input.pdf");
  const outPrefix = path.join(tmpDir, "output");

  try {
    await fs.writeFile(pdfPath, file.data);

    // -singlefile avoids the "-1" page suffix pdftoppm normally appends.
    await execFileAsync("pdftoppm", [
      "-png",
      "-r",
      "150",
      "-singlefile",
      "-scale-to",
      "800",
      pdfPath,
      outPrefix,
    ]);

    const pngBuffer = await fs.readFile(`${outPrefix}.png`);
    const baseName = path.parse(file.name).name;

    const thumbnailDoc = await req.payload.create({
      collection: "media",
      data: { alt: `${data.alt || "Certificate"} (preview)` },
      file: {
        data: pngBuffer,
        mimetype: "image/png",
        name: `${baseName}-preview.png`,
        size: pngBuffer.length,
      },
    });

    return { ...data, pdfThumbnail: thumbnailDoc.id };
  } catch (err) {
    req.payload.logger.error(
      `PDF thumbnail generation failed for ${file.name}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    // Don't block the upload if pdftoppm fails — just skip the thumbnail.
    return data;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
  },
  hooks: {
    beforeChange: [generatePdfThumbnail],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "pdfThumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Auto-generated PNG preview of page 1 — only set when this file is a PDF.",
        condition: (data) => data?.mimeType === "application/pdf",
      },
    },
  ],
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 576, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "application/pdf"],
  },
};
