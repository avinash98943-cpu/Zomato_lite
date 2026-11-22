import { sql } from "@/lib/db";

// POST /api/reviews — save one review. The backend never trusts the frontend:
// it re-checks everything, in order, and stops at the first failure.
export async function POST(request: Request) {
  let body: { restaurantId?: unknown; rating?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { restaurantId, rating, comment } = body;

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }

  if (typeof comment !== "string" || comment.trim() === "") {
    return Response.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return Response.json({ error: "That restaurant does not exist." }, { status: 400 });
  }
  const found = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (found.length === 0) {
    return Response.json({ error: "That restaurant does not exist." }, { status: 400 });
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id`;

  return Response.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
}
