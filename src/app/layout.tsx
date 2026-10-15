import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "../styles/globals.css";

const description =
  "A time bank for neighbors. Help someone for an hour and you earn an hour of help back, from anyone in the group. No money changes hands, and every member's hour counts the same.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "New Future Bank | A neighborhood time bank",
  description,
  openGraph: {
    title: "New Future Bank: Everything costs more. We have each other.",
    description,
    siteName: "New Future Bank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Future Bank: Everything costs more. We have each other.",
    description,
  },
};

// Fonts are the system's own (see globals.css), so nothing extra downloads
// on a slow phone plan.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
