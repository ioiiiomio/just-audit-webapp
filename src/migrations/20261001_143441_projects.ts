import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_about_features_icon" AS ENUM('video', 'users', 'book', 'star', 'target', 'eye', 'heart', 'lightbulb', 'handshake', 'graduation');
  CREATE TYPE "public"."enum_projects_values_icon" AS ENUM('video', 'users', 'book', 'star', 'target', 'eye', 'heart', 'lightbulb', 'handshake', 'graduation');
  CREATE TABLE "projects_about_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_projects_about_features_icon" DEFAULT 'star' NOT NULL
  );
  
  CREATE TABLE "projects_about_features_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_projects_values_icon" DEFAULT 'star' NOT NULL
  );
  
  CREATE TABLE "projects_values_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"hero_image_id" integer NOT NULL,
  	"hero_cta_new_tab" boolean DEFAULT false,
  	"gallery_more_link_new_tab" boolean DEFAULT false,
  	"join_cta_image_id" integer,
  	"join_cta_button_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"eyebrow" varchar,
  	"intro" varchar NOT NULL,
  	"hero_cta_label" varchar DEFAULT 'Отправить заявку',
  	"hero_cta_url" varchar,
  	"about_heading" varchar DEFAULT 'Что мы делаем',
  	"about_text" varchar,
  	"gallery_heading" varchar DEFAULT 'Наша команда в действии',
  	"gallery_more_link_label" varchar DEFAULT 'Смотреть больше',
  	"gallery_more_link_url" varchar,
  	"join_cta_eyebrow" varchar DEFAULT 'Присоединяйтесь',
  	"join_cta_heading" varchar DEFAULT 'Хотите стать частью команды?',
  	"join_cta_subheading" varchar,
  	"join_cta_button_label" varchar DEFAULT 'Заполнить заявку',
  	"join_cta_button_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects_about_features" ADD CONSTRAINT "projects_about_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_about_features_locales" ADD CONSTRAINT "projects_about_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_about_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_values" ADD CONSTRAINT "projects_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_values_locales" ADD CONSTRAINT "projects_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_join_cta_image_id_media_id_fk" FOREIGN KEY ("join_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_about_features_order_idx" ON "projects_about_features" USING btree ("_order");
  CREATE INDEX "projects_about_features_parent_id_idx" ON "projects_about_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_about_features_locales_locale_parent_id_unique" ON "projects_about_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_values_order_idx" ON "projects_values" USING btree ("_order");
  CREATE INDEX "projects_values_parent_id_idx" ON "projects_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_values_locales_locale_parent_id_unique" ON "projects_values_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_join_cta_join_cta_image_idx" ON "projects" USING btree ("join_cta_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_about_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_about_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_values_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_about_features" CASCADE;
  DROP TABLE "projects_about_features_locales" CASCADE;
  DROP TABLE "projects_values" CASCADE;
  DROP TABLE "projects_values_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_about_features_icon";
  DROP TYPE "public"."enum_projects_values_icon";`)
}
