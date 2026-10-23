import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- unrelated changes that got bundled in
    ALTER TABLE "projects_values" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean DEFAULT false;
    ALTER TABLE "projects_values_locales" ADD COLUMN IF NOT EXISTS "link_label" varchar DEFAULT 'Подробнее';
    ALTER TABLE "projects_values_locales" ADD COLUMN IF NOT EXISTS "link_url" varchar;

    -- 1. add as nullable first
    ALTER TABLE "team_members_items_locales" ADD COLUMN "name" varchar;

    -- 2. copy the current name into every locale (creates missing locale rows too)
    INSERT INTO "team_members_items_locales" ("_locale", "_parent_id", "name")
    SELECT loc, i."id", i."name"
    FROM "team_members_items" i
           CROSS JOIN unnest(enum_range(NULL::"_locales")) AS loc
      ON CONFLICT ("_locale", "_parent_id")
      DO UPDATE SET "name" = EXCLUDED."name";

    -- 3. now it's safe to enforce NOT NULL and drop the old column
    ALTER TABLE "team_members_items_locales" ALTER COLUMN "name" SET NOT NULL;
    ALTER TABLE "team_members_items" DROP COLUMN "name";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members_items" ADD COLUMN "name" varchar;

    -- restore from the default locale
    UPDATE "team_members_items" i
    SET "name" = l."name"
      FROM "team_members_items_locales" l
    WHERE l."_parent_id" = i."id" AND l."_locale" = 'ru';

    UPDATE "team_members_items" SET "name" = '' WHERE "name" IS NULL;
    ALTER TABLE "team_members_items" ALTER COLUMN "name" SET NOT NULL;

    ALTER TABLE "team_members_items_locales" DROP COLUMN "name";
    ALTER TABLE "projects_values" DROP COLUMN IF EXISTS "link_new_tab";
    ALTER TABLE "projects_values_locales" DROP COLUMN IF EXISTS "link_label";
    ALTER TABLE "projects_values_locales" DROP COLUMN IF EXISTS "link_url";
  `)
}