import type { FirstParameter } from "@/types";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.AUTH_DRIZZLE_URL });
export const db = drizzle(pool, { schema });

export type DbTransaction = FirstParameter<
  FirstParameter<typeof db.transaction>
>;
export type UpsertResult = { upsertedId: string };
