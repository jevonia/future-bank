import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "New Future Bank | Every hour has equal value",
  description: "Share skills, ask for help, and strengthen your community. New Future Bank is a time bank where one hour of help equals one time credit.",
};

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
