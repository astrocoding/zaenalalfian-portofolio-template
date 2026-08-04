import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
    template: "%s | Zaenal Alfian",
  },
  description:
    "Personal portfolio and technical showcase of Zaenal Alfian. Japanese minimalist design, clean architecture, Next.js 16, React 19, Prisma 7, and technical documentation.",
  keywords: [
    "Zaenal Alfian",
    "Full-Stack Engineer",
    "Frontend Architect",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "PostgreSQL",
    "Prisma 7",
    "Japanese Minimalist Design",
  ],
  authors: [{ name: "Zaenal Alfian", url: baseUrl }],
  creator: "Zaenal Alfian",
  publisher: "Zaenal Alfian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Zaenal Alfian Portfolio",
    title: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
    description:
      "Personal portfolio and technical showcase of Zaenal Alfian. Japanese minimalist design, clean architecture, Next.js 16, React 19, Prisma 7, and technical documentation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaenal Alfian — Senior Full-Stack Engineer & Product Architect",
    description:
      "Personal portfolio and technical showcase of Zaenal Alfian. Japanese minimalist design, clean architecture, Next.js 16, React 19, Prisma 7.",
    creator: "@zaenalalfian",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-[#dac0ca] selection:text-[#121212]">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
