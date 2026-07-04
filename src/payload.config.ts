import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { Certificates } from "./collections/Certificates";
import { Interns } from "./globals/Interns";
import { SiteSettings } from "./globals/SiteSettings";
import { Hero } from "./globals/Hero";
import { About } from "./globals/About";
import { Approach } from "./globals/Approach";
import { TeamMembers } from "./globals/TeamMembers";
import { WhyUs } from "./globals/WhyUs";
import { Submissions } from "./collections/Submissions";
import { Announcements } from "./collections/Announcements";
import { NavItems } from "./collections/NavItems";
import { Footer } from "./globals/Footer";

// pages
import { Careers } from "./globals/Careers";
import { CareerBenefits } from "./collections/CareerBenefits";
import { Car } from "lucide-react";

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
    Submissions,
    Services,
    Announcements,
    Certificates,
    NavItems,
    CareerBenefits,
  ],
  globals: [
    SiteSettings,
    Hero,
    About,
    Approach,
    TeamMembers,
    WhyUs,
    Interns,
    Footer,
    Careers,
  ],
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
    locales: ["ru", "kz", "en"],
    defaultLocale: "ru",
    fallback: true,
  },
  cors: [
    "https://justaudit.kz",
    "https://www.justaudit.kz",
    "https://just-audit-pi.vercel.app",
    "http://localhost:3000",
  ],
  csrf: [
    "https://justaudit.kz",
    "https://www.justaudit.kz",
    "https://just-audit-pi.vercel.app",
    "http://localhost:3000",
  ],
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: "auto",
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
