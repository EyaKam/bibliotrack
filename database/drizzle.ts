import { drizzle } from "drizzle-orm/neon-http";

// @ts-ignore
import { neon } from "@neondatabase/serverless";
import  config from "@/lib/config";

const sql = neon(config.env.database);
export const db = drizzle({ client: sql });
