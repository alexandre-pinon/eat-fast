ALTER TABLE "meals_to_ingredients" DROP CONSTRAINT "meals_to_ingredients_meal_id_meal_id_fk";
--> statement-breakpoint
ALTER TABLE "meals_to_ingredients" DROP CONSTRAINT "meals_to_ingredients_ingredient_id_ingredient_id_fk";
--> statement-breakpoint
ALTER TABLE "ingredient" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "meal" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal" ADD CONSTRAINT "meal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meals_to_ingredients" ADD CONSTRAINT "meals_to_ingredients_meal_id_meal_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meals_to_ingredients" ADD CONSTRAINT "meals_to_ingredients_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
