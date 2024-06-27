import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const neonConn = neon(process.env.AUTH_DRIZZLE_URL as string);
export const db = drizzle(neonConn, { schema });
