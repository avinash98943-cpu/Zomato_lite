import { neon } from "@neondatabase/serverless";

// One shared connection helper. DATABASE_URL comes from .env.local (locally)
// or from Vercel's environment variables (live).
export const sql = neon(process.env.DATABASE_URL!);
