CREATE TABLE "headless_cms_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" varchar(255) NOT NULL,
	"role" varchar(512) NOT NULL,
	"company" varchar(512) NOT NULL,
	"desc" text,
	"stacks" jsonb,
	"published" boolean DEFAULT false NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "headless_cms_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(512) NOT NULL,
	"slug" varchar(600) NOT NULL,
	"desc" text,
	"icon" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "headless_cms_experiences" ADD CONSTRAINT "headless_cms_experiences_author_id_headless_cms_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."headless_cms_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "headless_cms_services" ADD CONSTRAINT "headless_cms_services_author_id_headless_cms_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."headless_cms_users"("id") ON DELETE cascade ON UPDATE no action;