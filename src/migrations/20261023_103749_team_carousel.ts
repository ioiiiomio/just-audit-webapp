import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members_items" ADD COLUMN "show_on_homepage" boolean DEFAULT false;
  ALTER TABLE "team_members_locales" ADD COLUMN "carousel_heading" varchar;
  ALTER TABLE "team_members_locales" ADD COLUMN "view_all_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members_items" DROP COLUMN "show_on_homepage";
  ALTER TABLE "team_members_locales" DROP COLUMN "carousel_heading";
  ALTER TABLE "team_members_locales" DROP COLUMN "view_all_label";`)
}
