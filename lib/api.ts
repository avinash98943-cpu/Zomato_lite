import { headers } from "next/headers";
import type { RestaurantPage } from "./types";

// Server-side helper: reads a restaurant from our own backend API.
// The pages never touch the database directly — they only talk to the API.
export async function getRestaurant(id: string): Promise<RestaurantPage | null> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const res = await fetch(`${proto}://${host}/api/restaurants/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
