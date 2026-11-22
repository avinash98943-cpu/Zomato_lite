import { sql } from "@/lib/db";

export const dynamic = "force-dynamic"; // never cache: answers are computed fresh

// GET /api/restaurants/[id] — shaped exactly like the restaurant screen.
// Facts are stored; answers (average, count, latest) are computed here, now.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurants = await sql`SELECT name, cuisine, area FROM restaurants WHERE id = ${id}`;
  if (restaurants.length === 0) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  // The intelligence of the product: AVG and COUNT, computed on demand.
  // With no reviews AVG is NULL and COUNT is 0 — we pass that through honestly
  // instead of inventing a "0 stars", which would be a lie.
  const stats = await sql`
    SELECT ROUND(AVG(rating)::numeric, 1) AS average, COUNT(*)::int AS total
    FROM reviews WHERE restaurant_id = ${id}`;

  const rows = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews WHERE restaurant_id = ${id}
    ORDER BY created_at DESC`;

  const all = rows.map((r) => ({
    id: r.id as number,
    rating: r.rating as number,
    comment: r.comment as string,
    createdAt: new Date(r.created_at).toISOString(),
  }));

  return Response.json({
    ...restaurants[0],
    averageRating: stats[0].average === null ? null : Number(stats[0].average),
    totalReviews: stats[0].total as number,
    latestReview: all[0] ?? null, // newest first, so the first row is the latest
    reviews: all.slice(1), // everything except the latest
  });
}
