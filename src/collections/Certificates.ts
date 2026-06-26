import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import type { CollectionConfig } from "payload";

const execFileAsync = promisify(execFile);
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const UPLOADS_DIR = path.resolve(dirname, "../../uploads");

export const Certificates: CollectionConfig = {
  slug: "certificates",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "issuedBy", "issueDate", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      // Auto-populated by the afterChange hook below when `image` is a PDF.
      // Left out of the default admin columns since editors never set it manually.
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        readOnly: true,
        description:
          "Auto-generated from page 1 when the uploaded file is a PDF",
      },
    },
    {
      name: "issuedBy",
      type: "text",
    },
    {
      name: "issueDate",
      type: "date",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Controls position in the certificates carousel",
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        // Guard against the recursive update we trigger below
        if (context?.skipThumbnailHook) return doc;
        if (!doc.image) return doc;

        // Only regenerate when the image actually changed
        const imageChanged = doc.image !== previousDoc?.image;
        if (doc.thumbnail && !imageChanged) return doc;

        const mediaDoc = await req.payload.findByID({
          collection: "media",
          id: typeof doc.image === "object" ? doc.image.id : doc.image,
        });

        if (mediaDoc.mimeType !== "application/pdf") return doc;

        try {
          const inputPath = path.join(UPLOADS_DIR, mediaDoc.filename as string);
          const outputPrefix = path.join(UPLOADS_DIR, `__thumb_${doc.id}`);

          req.payload.logger.info(`pdftoppm input: ${inputPath}`);

          await execFileAsync("pdftoppm", [
            "-png",
            "-f",
            "1",
            "-l",
            "1",
            "-scale-to",
            "800",
            inputPath,
            outputPrefix,
          ]);

          // pdftoppm appends -1.png (or -01.png depending on page count digits)
          const generatedName = `${path.basename(outputPrefix)}-1.png`;
          const generatedPath = path.join(UPLOADS_DIR, generatedName);
          const buffer = await fs.readFile(generatedPath);
          await fs.unlink(generatedPath).catch(() => {});

          const thumbnailMedia = await req.payload.create({
            collection: "media",
            data: { alt: `${doc.title} thumbnail` },
            file: {
              data: buffer,
              mimetype: "image/png",
              name: `certificate-${doc.id}-thumb.png`,
              size: buffer.length,
            },
          });

          await req.payload.update({
            collection: "certificates",
            id: doc.id,
            data: { thumbnail: thumbnailMedia.id },
            context: { skipThumbnailHook: true },
          });
        } catch (err: any) {
          req.payload.logger.error(
            `PDF thumbnail generation failed for certificate ${doc.id}: ${err?.message ?? err}`,
          );
          if (err?.stack) req.payload.logger.error(err.stack);
        }

        return doc;
      },
    ],
  },
};
