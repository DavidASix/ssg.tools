ALTER TABLE "user"
ADD COLUMN "stripe_customer_id" text;

ALTER TABLE "user"
ADD CONSTRAINT "user_stripe_customer_id_unique" UNIQUE ("stripe_customer_id");

CREATE TABLE
	"subscription_payments" (
		"id" serial PRIMARY KEY NOT NULL,
		"user_id" text NOT NULL,
		"stripe_customer_id" text,
		"invoice_id" text NOT NULL,
		"amount" integer,
		"currency" text,
		"billing_reason" text,
		"subscription_start" timestamp with time zone NOT NULL,
		"subscription_end" timestamp with time zone NOT NULL,
		"created_at" timestamp with time zone NOT NULL
	);

ALTER TABLE "subscription_payments"
ADD CONSTRAINT "subscription_payments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;