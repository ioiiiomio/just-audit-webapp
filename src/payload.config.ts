import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { TeamMembers } from "./collections/TeamMembers";
import { Certificates } from "./collections/Certificates";
import { Interns } from "./collections/Interns";
import { Submissions } from "./collections/Submissions";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Just Audit CMS",
    },
  },
  collections: [
    Users,
    Media,
    Services,
    TeamMembers,
    Certificates,
    Interns,
    Submissions,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
  // NOTE: 'kz' is used here as the project's chosen URL/locale code for the
  // Kazakh-language version of the site (matching the next-intl routing
  // config), even though the strict ISO 639-1 code for Kazakh is 'kk'.
  // Keep this in sync with src/i18n/routing.ts.
  localization: {
    locales: ["ru", "kz"],
    defaultLocale: "ru",
    fallback: true,
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ""].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ""].filter(Boolean),
});
