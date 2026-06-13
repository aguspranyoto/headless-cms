CREATE TABLE "headless_cms_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(512) NOT NULL,
	"slug" varchar(600) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image" varchar(1024),
	"github_url" varchar(1024),
	"demo_url" varchar(1024),
	"technologies" varchar(1024),
	"published" boolean DEFAULT false NOT NULL,
	"author_id" uuid NOT NULL,
	"category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "headless_cms_projects" ADD CONSTRAINT "headless_cms_projects_author_id_headless_cms_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."headless_cms_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "headless_cms_projects" ADD CONSTRAINT "headless_cms_projects_category_id_headless_cms_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."headless_cms_categories"("id") ON DELETE set null ON UPDATE no action;