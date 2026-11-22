// Applies db/schema.sql and db/seed.sql to the database in DATABASE_URL.
// Run with: npm run db:setup  (wipes and recreates the two tables)
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);
const run = (file) =>
  readFileSync(new URL(file, import.meta.url), "utf8")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

await sql.query("DROP TABLE IF EXISTS reviews");
await sql.query("DROP TABLE IF EXISTS restaurants");
for (const stmt of [...run("./schema.sql"), ...run("./seed.sql")]) await sql.query(stmt);

console.log("restaurants:", await sql.query("SELECT * FROM restaurants"));
console.log("reviews:", await sql.query("SELECT * FROM reviews ORDER BY created_at"));
