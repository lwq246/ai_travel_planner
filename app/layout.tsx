import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Travel Planner - Plan Your Perfect Trip With AI",
    template: "%s | AI Travel Planner",
  },
  description:
    "Generate personalized travel itineraries in seconds with AI-powered trip planning. Plan your dream vacation with ease.",
  keywords: [
    "AI travel planner",
    "travel itinerary",
    "trip planning",
    "vacation planner",
    "AI trip generator",
    "travel planning app",
  ],
  authors: [{ name: "AI Travel Planner" }],
  creator: "AI Travel Planner",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AI Travel Planner - Plan Your Perfect Trip With AI",
    description:
      "Generate personalized travel itineraries in seconds with AI-powered trip planning. Plan your dream vacation with ease.",
    siteName: "AI Travel Planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Travel Planner - Plan Your Perfect Trip With AI",
    description:
      "Generate personalized travel itineraries in seconds with AI-powered trip planning.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://ai-travel-planner.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
