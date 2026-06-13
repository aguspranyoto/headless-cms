CREATE TABLE "headless_cms_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"description" varchar(512),
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "headless_cms_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "headless_cms_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(512) NOT NULL,
	"slug" varchar(600) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"author_id" uuid NOT NULL,
	"category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "headless_cms_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(64) NOT NULL,
	"password_hash" varchar(512) NOT NULL,
	"display_name" varchar(128),
	"avatar_url" varchar(512),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_users_email_unique" UNIQUE("email"),
	CONSTRAINT "headless_cms_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "headless_cms_posts" ADD CONSTRAINT "headless_cms_posts_author_id_headless_cms_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."headless_cms_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "headless_cms_posts" ADD CONSTRAINT "headless_cms_posts_category_id_headless_cms_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."headless_cms_categories"("id") ON DELETE set null ON UPDATE no action;