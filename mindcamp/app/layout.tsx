import type { Metadata } from "next";
import "./globals.css";
import { InteractionGlow } from "@/components/InteractionGlow";

export const metadata: Metadata = {
  title: "Clarity Journal - Build the habit of knowing yourself",
  description: "A simple daily journal that helps you reflect, track patterns, and build consistency. 2 minutes a day, real insights over time.",
  keywords: ["journal", "journaling", "clarity", "self-improvement", "habit", "daily journal", "reflect"],
  authors: [{ name: "Clarity Journal" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Clarity Journal - Build the habit of knowing yourself",
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
        <InteractionGlow />
        {children}
      </body>
    </html>
  );
}
