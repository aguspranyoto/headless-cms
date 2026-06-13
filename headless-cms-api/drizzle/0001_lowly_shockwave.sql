CREATE TABLE "headless_cms_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "headless_cms_verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "headless_cms_users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "headless_cms_verification_tokens" ADD CONSTRAINT "headless_cms_verification_tokens_user_id_headless_cms_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."headless_cms_users"("id") ON DELETE cascade ON UPDATE no action;