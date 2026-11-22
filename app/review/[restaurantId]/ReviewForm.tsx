"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ restaurantId }: { restaurantId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const canSubmit = rating > 0 && comment.trim() !== "" && !busy;

  async function submit() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, rating, comment }),
    });
    if (res.ok) {
      router.push(`/restaurant/${restaurantId}`);
      return;
    }
    // Show exactly what the backend said — the frontend invents no messages.
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong.");
    setBusy(false);
  }

  return (
    <div className="mt-8">
      <div className="flex gap-2" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            onClick={() => setRating(n)}
            className={`h-12 w-12 rounded-lg border text-lg transition-colors ${
              n <= rating
                ? "border-accent bg-accent text-white"
                : "border-line bg-white text-muted hover:border-foreground"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What was it like?"
        rows={5}
        className="mt-6 w-full resize-none rounded-lg border border-line bg-white p-4 outline-none focus:border-foreground"
      />

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="mt-6 rounded-lg bg-foreground px-5 py-3 text-sm text-background disabled:opacity-30"
      >
        Submit
      </button>
    </div>
  );
}
