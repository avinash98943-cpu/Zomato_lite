import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/api";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ReviewBody({ r }: { r: Review }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm text-accent">{r.rating} / 5</span>
        <span className="text-xs text-muted">{when(r.createdAt)}</span>
      </div>
      <p className="mt-2 leading-relaxed">{r.comment}</p>
    </>
  );
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurant(id);
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {data.cuisine} · {data.area}
      </p>

      <div className="mt-10 flex items-baseline gap-3">
        {data.averageRating === null ? (
          <span className="text-2xl text-muted">No ratings yet</span>
        ) : (
          <>
            {/* The average is printed exactly as the backend sent it. No maths here. */}
            <span className="text-7xl font-semibold tracking-tight">{data.averageRating}</span>
            <span className="text-sm text-muted">
              {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </>
        )}
      </div>

      {data.latestReview === null ? (
        <div className="mt-10 rounded-lg border border-dashed border-line p-6 text-center">
          <p className="text-muted">Nobody has reviewed this place yet.</p>
          <Link href={`/review/${id}`} className="mt-3 inline-block text-accent underline underline-offset-4">
            Be the first to write one
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-10 rounded-lg border border-line border-l-4 border-l-accent bg-white p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted">Latest review</p>
            <ReviewBody r={data.latestReview} />
          </section>

          {data.reviews.length > 0 && (
            <ul className="mt-8 divide-y divide-line">
              {data.reviews.map((r) => (
                <li key={r.id} className="py-4">
                  <ReviewBody r={r} />
                </li>
              ))}
            </ul>
          )}

          <Link
            href={`/review/${id}`}
            className="mt-10 inline-block rounded-lg bg-foreground px-5 py-3 text-sm text-background"
          >
            Write a review
          </Link>
        </>
      )}
    </div>
  );
}
