DROP INDEX IF EXISTS "user_id_name_unique_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_name_unique_idx" ON "ingredient" USING btree ("user_id","name");