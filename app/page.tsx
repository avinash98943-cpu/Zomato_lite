import Link from "next/link";

export default function Home() {
  return (
    <p className="text-muted">
      Zomato Lite is alive.{" "}
      <Link href="/restaurant/1" className="text-accent underline underline-offset-4">
        See Ludhiana Burrito
      </Link>
    </p>
  );
}
