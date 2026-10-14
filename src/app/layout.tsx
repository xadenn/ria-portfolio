import type { Metadata } from "next";
import { Outfit, Noto_Sans, Playfair_Display, Kanit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ria-verma-portfolio.vercel.app"),
  title: {
    default: "Ria Verma — Design Engineer & Brand Designer",
    template: "%s | Ria Verma",
  },
  description:
    "Ria Verma is a Multidisciplinary UI/UX & Brand Designer with 2+ years of industry experience creating user-centered interfaces, digital platforms, and strong brand systems.",
  keywords: [
    "Ria Verma",
    "Design Engineer",
    "UI/UX Designer",
    "Brand Designer",
    "Product Designer",
    "Bangalore",
    "Kristu Jayanti University",
    "Design Systems",
    "Frontend Engineering",
  ],
  authors: [{ name: "Ria Verma", url: "https://ria-verma-portfolio.vercel.app" }],
  creator: "Ria Verma",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ria Verma — Design Engineer & Brand Designer",
    description:
      "Multidisciplinary UI/UX & Brand Designer with 2+ years of industry experience creating user-centered interfaces, digital platforms, and strong brand systems.",
    type: "website",
    url: "https://ria-verma-portfolio.vercel.app",
    siteName: "Ria Verma Atelier",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ria Verma — Design Engineer Portfolio Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ria Verma — Design Engineer & Brand Designer",
    description:
      "Multidisciplinary UI/UX & Brand Designer creating user-centered interfaces, digital platforms, and strong brand systems.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { PortfolioProvider } from "@/context/PortfolioContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", kanit.variable, outfit.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}>
      <body className="min-h-full flex flex-col bg-[#0C0C0C] text-white antialiased overflow-x-clip">
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
