import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Zomato Lite", description: "Reviews for Ludhiana Burrito" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto w-full max-w-[560px] px-5 py-12">{children}</main>
      </body>
    </html>
  );
}
