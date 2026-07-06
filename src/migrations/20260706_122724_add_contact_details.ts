import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_details_type" AS ENUM('address', 'phone', 'email', 'whatsapp', 'telegram', 'instagram', 'linkedin', 'website', 'other');
  CREATE TYPE "public"."enum_submissions_type" AS ENUM('contact', 'career');
  ALTER TYPE "public"."_locales" ADD VALUE 'en';
  CREATE TABLE "contact_details" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_contact_details_type" NOT NULL,
  	"value" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_details_locales" (
  	"address_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "career_benefits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"icon" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "career_benefits_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"eyebrow" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"primary_button_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "careers_locales" (
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"primary_button_label" varchar,
  	"secondary_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "certificates_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "certificates_locales" CASCADE;
  ALTER TABLE "submissions" ADD COLUMN "type" "enum_submissions_type" DEFAULT 'contact' NOT NULL;
  ALTER TABLE "submissions" ADD COLUMN "city" varchar;
  ALTER TABLE "submissions" ADD COLUMN "position" varchar;
  ALTER TABLE "submissions" ADD COLUMN "resume_id" integer;
  ALTER TABLE "certificates" ADD COLUMN "title" varchar;
  ALTER TABLE "certificates" ADD COLUMN "issued_by" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_details_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "career_benefits_id" integer;
  ALTER TABLE "contact_details_locales" ADD CONSTRAINT "contact_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_benefits_locales" ADD CONSTRAINT "career_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs" ADD CONSTRAINT "about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs_locales" ADD CONSTRAINT "about_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_services" ADD CONSTRAINT "footer_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_services" ADD CONSTRAINT "footer_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers" ADD CONSTRAINT "careers_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_locales" ADD CONSTRAINT "careers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_details_updated_at_idx" ON "contact_details" USING btree ("updated_at");
  CREATE INDEX "contact_details_created_at_idx" ON "contact_details" USING btree ("created_at");
  CREATE UNIQUE INDEX "contact_details_locales_locale_parent_id_unique" ON "contact_details_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "career_benefits_updated_at_idx" ON "career_benefits" USING btree ("updated_at");
  CREATE INDEX "career_benefits_created_at_idx" ON "career_benefits" USING btree ("created_at");
  CREATE UNIQUE INDEX "career_benefits_locales_locale_parent_id_unique" ON "career_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_paragraphs_order_idx" ON "about_paragraphs" USING btree ("_order");
  CREATE INDEX "about_paragraphs_parent_id_idx" ON "about_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_paragraphs_locales_locale_parent_id_unique" ON "about_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_services_order_idx" ON "footer_services" USING btree ("_order");
  CREATE INDEX "footer_services_parent_id_idx" ON "footer_services" USING btree ("_parent_id");
  CREATE INDEX "footer_services_service_idx" ON "footer_services" USING btree ("service_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "careers_hero_image_idx" ON "careers" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "careers_locales_locale_parent_id_unique" ON "careers_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_details_fk" FOREIGN KEY ("contact_details_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_career_benefits_fk" FOREIGN KEY ("career_benefits_id") REFERENCES "public"."career_benefits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "submissions_resume_idx" ON "submissions" USING btree ("resume_id");
  CREATE INDEX "payload_locked_documents_rels_contact_details_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_details_id");
  CREATE INDEX "payload_locked_documents_rels_career_benefits_id_idx" ON "payload_locked_documents_rels" USING btree ("career_benefits_id");
  ALTER TABLE "site_settings" DROP COLUMN "contact_phone";
  ALTER TABLE "site_settings" DROP COLUMN "contact_email";
  ALTER TABLE "site_settings" DROP COLUMN "contact_whatsapp";
  ALTER TABLE "site_settings" DROP COLUMN "contact_telegram";
  ALTER TABLE "site_settings" DROP COLUMN "contact_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "contact_socail_project";
  ALTER TABLE "site_settings" DROP COLUMN "contact_linkedin";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_description";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_address1";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_address2";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_address3";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_representatives";
  ALTER TABLE "about_locales" DROP COLUMN "paragraph1";
  ALTER TABLE "about_locales" DROP COLUMN "paragraph2";
  ALTER TABLE "about_locales" DROP COLUMN "paragraph3";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "certificates_locales" (
  	"title" varchar NOT NULL,
  	"issued_by" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "contact_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_details_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_benefits_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_details" CASCADE;
  DROP TABLE "contact_details_locales" CASCADE;
  DROP TABLE "career_benefits" CASCADE;
  DROP TABLE "career_benefits_locales" CASCADE;
  DROP TABLE "about_paragraphs" CASCADE;
  DROP TABLE "about_paragraphs_locales" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "footer_services" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "careers" CASCADE;
  DROP TABLE "careers_locales" CASCADE;
  ALTER TABLE "submissions" DROP CONSTRAINT "submissions_resume_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_details_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_career_benefits_fk";
  
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "services_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "announcements_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "certificates_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "hero_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "about_principles_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "about_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "approach_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "approach_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "team_members_items_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "team_members_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "why_us_points_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "why_us_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "interns_requirements" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "interns_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('ru', 'kz');
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "services_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "announcements_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "certificates_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "site_settings_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "hero_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "about_principles_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "about_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "approach_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "approach_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "team_members_items_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "team_members_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "why_us_points_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "why_us_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "interns_requirements" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "interns_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  DROP INDEX "submissions_resume_idx";
  DROP INDEX "payload_locked_documents_rels_contact_details_id_idx";
  DROP INDEX "payload_locked_documents_rels_career_benefits_id_idx";
  ALTER TABLE "site_settings" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_whatsapp" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_telegram" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_instagram" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_socail_project" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_linkedin" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_description" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_address1" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_address2" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_address3" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_representatives" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "paragraph1" varchar NOT NULL;
  ALTER TABLE "about_locales" ADD COLUMN "paragraph2" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "paragraph3" varchar;
  ALTER TABLE "certificates_locales" ADD CONSTRAINT "certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "certificates_locales_locale_parent_id_unique" ON "certificates_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "submissions" DROP COLUMN "type";
  ALTER TABLE "submissions" DROP COLUMN "city";
  ALTER TABLE "submissions" DROP COLUMN "position";
  ALTER TABLE "submissions" DROP COLUMN "resume_id";
  ALTER TABLE "certificates" DROP COLUMN "title";
  ALTER TABLE "certificates" DROP COLUMN "issued_by";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_details_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "career_benefits_id";
  DROP TYPE "public"."enum_contact_details_type";
  DROP TYPE "public"."enum_submissions_type";`)
}
