import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_education_materials_content_type" AS ENUM('video', 'article');
  CREATE TYPE "public"."enum_education_materials_format" AS ENUM('pdf', 'video', 'document', 'excel');
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "education_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_categories_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "education_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_topics_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "education_materials_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic_id" integer NOT NULL,
  	"order" numeric DEFAULT 0
  );
  
  CREATE TABLE "education_materials_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "education_materials_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "education_materials_expert_bullet_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "education_materials_expert_bullet_points_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "education_materials_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "education_materials_download_files_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "education_materials_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "education_materials_tags_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "education_materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"content_type" "enum_education_materials_content_type" NOT NULL,
  	"type_id" integer NOT NULL,
  	"format" "enum_education_materials_format",
  	"category_id" integer,
  	"video_url" varchar,
  	"duration_seconds" numeric,
  	"thumbnail_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"expert_name" varchar,
  	"expert_photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_materials_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"expert_role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "education_material_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_material_types_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_topics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_materials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_material_types_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_name" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_categories_locales" ADD CONSTRAINT "education_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_topics_locales" ADD CONSTRAINT "education_topics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_topics" ADD CONSTRAINT "education_materials_topics_topic_id_education_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."education_topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials_topics" ADD CONSTRAINT "education_materials_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_faq" ADD CONSTRAINT "education_materials_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_faq_locales" ADD CONSTRAINT "education_materials_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_expert_bullet_points" ADD CONSTRAINT "education_materials_expert_bullet_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_expert_bullet_points_locales" ADD CONSTRAINT "education_materials_expert_bullet_points_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials_expert_bullet_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_download_files" ADD CONSTRAINT "education_materials_download_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials_download_files" ADD CONSTRAINT "education_materials_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_download_files_locales" ADD CONSTRAINT "education_materials_download_files_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials_download_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_tags" ADD CONSTRAINT "education_materials_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials_tags_locales" ADD CONSTRAINT "education_materials_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_materials" ADD CONSTRAINT "education_materials_type_id_education_material_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."education_material_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials" ADD CONSTRAINT "education_materials_category_id_education_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."education_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials" ADD CONSTRAINT "education_materials_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials" ADD CONSTRAINT "education_materials_expert_photo_id_media_id_fk" FOREIGN KEY ("expert_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_materials_locales" ADD CONSTRAINT "education_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_material_types_locales" ADD CONSTRAINT "education_material_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_material_types"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_featured_image_idx" ON "pages" USING btree ("featured_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "education_categories_slug_idx" ON "education_categories" USING btree ("slug");
  CREATE INDEX "education_categories_updated_at_idx" ON "education_categories" USING btree ("updated_at");
  CREATE INDEX "education_categories_created_at_idx" ON "education_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "education_categories_locales_locale_parent_id_unique" ON "education_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "education_topics_slug_idx" ON "education_topics" USING btree ("slug");
  CREATE INDEX "education_topics_updated_at_idx" ON "education_topics" USING btree ("updated_at");
  CREATE INDEX "education_topics_created_at_idx" ON "education_topics" USING btree ("created_at");
  CREATE UNIQUE INDEX "education_topics_locales_locale_parent_id_unique" ON "education_topics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "education_materials_topics_order_idx" ON "education_materials_topics" USING btree ("_order");
  CREATE INDEX "education_materials_topics_parent_id_idx" ON "education_materials_topics" USING btree ("_parent_id");
  CREATE INDEX "education_materials_topics_topic_idx" ON "education_materials_topics" USING btree ("topic_id");
  CREATE INDEX "education_materials_faq_order_idx" ON "education_materials_faq" USING btree ("_order");
  CREATE INDEX "education_materials_faq_parent_id_idx" ON "education_materials_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "education_materials_faq_locales_locale_parent_id_unique" ON "education_materials_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "education_materials_expert_bullet_points_order_idx" ON "education_materials_expert_bullet_points" USING btree ("_order");
  CREATE INDEX "education_materials_expert_bullet_points_parent_id_idx" ON "education_materials_expert_bullet_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "education_materials_expert_bullet_points_locales_locale_pare" ON "education_materials_expert_bullet_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "education_materials_download_files_order_idx" ON "education_materials_download_files" USING btree ("_order");
  CREATE INDEX "education_materials_download_files_parent_id_idx" ON "education_materials_download_files" USING btree ("_parent_id");
  CREATE INDEX "education_materials_download_files_file_idx" ON "education_materials_download_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "education_materials_download_files_locales_locale_parent_id_" ON "education_materials_download_files_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "education_materials_tags_order_idx" ON "education_materials_tags" USING btree ("_order");
  CREATE INDEX "education_materials_tags_parent_id_idx" ON "education_materials_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "education_materials_tags_locales_locale_parent_id_unique" ON "education_materials_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "education_materials_slug_idx" ON "education_materials" USING btree ("slug");
  CREATE INDEX "education_materials_type_idx" ON "education_materials" USING btree ("type_id");
  CREATE INDEX "education_materials_category_idx" ON "education_materials" USING btree ("category_id");
  CREATE INDEX "education_materials_thumbnail_idx" ON "education_materials" USING btree ("thumbnail_id");
  CREATE INDEX "education_materials_expert_expert_photo_idx" ON "education_materials" USING btree ("expert_photo_id");
  CREATE INDEX "education_materials_updated_at_idx" ON "education_materials" USING btree ("updated_at");
  CREATE INDEX "education_materials_created_at_idx" ON "education_materials" USING btree ("created_at");
  CREATE UNIQUE INDEX "education_materials_locales_locale_parent_id_unique" ON "education_materials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "education_material_types_slug_idx" ON "education_material_types" USING btree ("slug");
  CREATE INDEX "education_material_types_updated_at_idx" ON "education_material_types" USING btree ("updated_at");
  CREATE INDEX "education_material_types_created_at_idx" ON "education_material_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "education_material_types_locales_locale_parent_id_unique" ON "education_material_types_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_categories_fk" FOREIGN KEY ("education_categories_id") REFERENCES "public"."education_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_topics_fk" FOREIGN KEY ("education_topics_id") REFERENCES "public"."education_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_materials_fk" FOREIGN KEY ("education_materials_id") REFERENCES "public"."education_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_material_types_fk" FOREIGN KEY ("education_material_types_id") REFERENCES "public"."education_material_types"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_education_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("education_categories_id");
  CREATE INDEX "payload_locked_documents_rels_education_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("education_topics_id");
  CREATE INDEX "payload_locked_documents_rels_education_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("education_materials_id");
  CREATE INDEX "payload_locked_documents_rels_education_material_types_i_idx" ON "payload_locked_documents_rels" USING btree ("education_material_types_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_topics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_expert_bullet_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_expert_bullet_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_download_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_download_files_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_materials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_material_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_material_types_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "education_categories" CASCADE;
  DROP TABLE "education_categories_locales" CASCADE;
  DROP TABLE "education_topics" CASCADE;
  DROP TABLE "education_topics_locales" CASCADE;
  DROP TABLE "education_materials_topics" CASCADE;
  DROP TABLE "education_materials_faq" CASCADE;
  DROP TABLE "education_materials_faq_locales" CASCADE;
  DROP TABLE "education_materials_expert_bullet_points" CASCADE;
  DROP TABLE "education_materials_expert_bullet_points_locales" CASCADE;
  DROP TABLE "education_materials_download_files" CASCADE;
  DROP TABLE "education_materials_download_files_locales" CASCADE;
  DROP TABLE "education_materials_tags" CASCADE;
  DROP TABLE "education_materials_tags_locales" CASCADE;
  DROP TABLE "education_materials" CASCADE;
  DROP TABLE "education_materials_locales" CASCADE;
  DROP TABLE "education_material_types" CASCADE;
  DROP TABLE "education_material_types_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_education_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_education_topics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_education_materials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_education_material_types_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_education_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_education_topics_id_idx";
  DROP INDEX "payload_locked_documents_rels_education_materials_id_idx";
  DROP INDEX "payload_locked_documents_rels_education_material_types_i_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "education_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "education_topics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "education_materials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "education_material_types_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_name";
  ALTER TABLE "site_settings_locales" DROP COLUMN "meta_description";
  DROP TYPE "public"."enum_education_materials_content_type";
  DROP TYPE "public"."enum_education_materials_format";`)
}
