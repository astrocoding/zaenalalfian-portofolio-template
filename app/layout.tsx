import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo";

/**
 * Primary UI font — variable font covers all weights (200–800).
 * display:block = browser waits for font before showing text.
 * For local fonts this wait is ~20-50ms (disk read), imperceptible.
 * preload:true = <link rel="preload"> injected in <head> so font
 * is fetched immediately when HTML is parsed, before CSS processing.
 */
const plusJakarta = localFont({
  src: [
    {
      path: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta",
  display: "block",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

/**
 * Serif display font — used for headings & kanji.
 * display:block + preload:true = heading font ready before first render.
 * Prevents fallback Georgia showing on headings during hard refresh.
 */
const newsreader = localFont({
  src: [
    {
      path: "./fonts/Newsreader-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/Newsreader-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "block",
  preload: true,
  fallback: ["Georgia", "serif"],
});

/**
 * Monospace font — used for code blocks & architecture card.
 * display:block = no FOUT. Local load is fast enough that
 * the brief invisible-text period (~30ms) is imperceptible.
 */
const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-jetbrains",
  display: "block",
  preload: false,
  fallback: ["Menlo", "Monaco", "Consolas", "monospace"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-[#dac0ca] selection:text-[#121212]">
        {children}
      </body>
    </html>
  );
}
