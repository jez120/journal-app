import type { Metadata } from "next";
import "./globals.css";
import { InteractionGlow } from "@/components/InteractionGlow";
import { FixedBackground } from "@/components/FixedBackground";
import { DevTools } from "@/components/DevTools";
import { ClientNetworkGuard } from "@/components/ClientNetworkGuard";

export const metadata: Metadata = {
  title: "Clarity Journal - Build the habit of knowing yourself",
  description: "A simple daily journal that helps you reflect, track patterns, and build consistency. 2 minutes a day, real insights over time.",
  keywords: ["journal", "journaling", "clarity", "self-improvement", "habit", "daily journal", "reflect"],
  authors: [{ name: "Clarity Journal" }],
  icons: {
    icon: "/icons/AppLogo.png",
    apple: "/icons/AppLogo.png",
  },
  manifest: "/manifest.json",
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <ClientNetworkGuard />
        <FixedBackground />
        <InteractionGlow />
        {children}
        <DevTools />
      </body>
    </html>
  );
}
