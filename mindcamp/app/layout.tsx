import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MindCamp - Bootcamp for Your Brain",
  description: "Journal daily or lose your rank. Build lasting journaling habits with bootcamp structure and discovery mechanics.",
  keywords: ["journal", "journaling", "mindfulness", "self-improvement", "habit", "streak"],
  authors: [{ name: "MindCamp" }],
  openGraph: {
    title: "MindCamp - Bootcamp for Your Brain",
    description: "Journal daily or lose your rank.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
