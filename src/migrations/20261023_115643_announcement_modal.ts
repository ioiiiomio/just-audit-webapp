import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_display" AS ENUM('banner', 'modal');
  ALTER TABLE "announcements" ADD COLUMN "display" "enum_announcements_display" DEFAULT 'banner' NOT NULL;
  ALTER TABLE "announcements" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "announcements" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "announcements_locales" ADD COLUMN "contact_name" varchar;
  ALTER TABLE "announcements_locales" ADD COLUMN "contact_note" varchar;
  ALTER TABLE "announcements_locales" ADD COLUMN "button_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements" DROP COLUMN "display";
  ALTER TABLE "announcements" DROP COLUMN "contact_phone";
  ALTER TABLE "announcements" DROP COLUMN "contact_email";
  ALTER TABLE "announcements_locales" DROP COLUMN "contact_name";
  ALTER TABLE "announcements_locales" DROP COLUMN "contact_note";
  ALTER TABLE "announcements_locales" DROP COLUMN "button_label";
  DROP TYPE "public"."enum_announcements_display";`)
}
