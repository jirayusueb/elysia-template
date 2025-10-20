import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { WebSocket } from "ws";
import { env } from "../env";

neonConfig.webSocketConstructor = WebSocket;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql);
