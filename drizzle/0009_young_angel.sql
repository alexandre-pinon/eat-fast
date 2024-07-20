ALTER TABLE "meal" ADD COLUMN "servings" integer DEFAULT 1 NOT NULL;--> statement-breakpoint

ALTER TABLE "meals_to_ingredients" ADD COLUMN "quantity_with_servings" numeric DEFAULT '0' NOT NULL;

UPDATE "meals_to_ingredients" SET "quantity_with_servings" = "quantity";
