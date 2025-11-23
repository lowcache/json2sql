CREATE TABLE "purchases" (
	"user_id" text,
	"stripe_payment_intent_id" text,
	"amount" integer,
	"purchased_at" timestamp DEFAULT now(),
	CONSTRAINT "purchases_user_id_stripe_payment_intent_id_pk" PRIMARY KEY("user_id","stripe_payment_intent_id"),
	CONSTRAINT "purchases_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"premium" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;