import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindCamp - Build the habit of knowing yourself",
  description: "A simple daily journal that helps you reflect, track patterns, and build consistency. 2 minutes a day, real insights over time.",
  keywords: ["journal", "journaling", "mindfulness", "self-improvement", "habit", "daily journal"],
  authors: [{ name: "MindCamp" }],
  openGraph: {
    title: "MindCamp - Build the habit of knowing yourself",
    description: "A simple daily journal for reflection and self-discovery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
