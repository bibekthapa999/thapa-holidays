import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ChatWidget";
import { Providers } from "@/components/providers";
import LayoutContent from "@/components/LayoutContent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Thapa Holidays - Best Travel Agency in India | Tour Packages",
    template: "%s | Thapa Holidays",
  },
  description:
    "Discover incredible India with Thapa Holidays. Book affordable tour packages to Sikkim, Darjeeling, Goa, Kerala, Rajasthan and more. 15+ years of excellence in travel.",
  keywords: [
    "travel agency",
    "tour packages",
    "India tours",
    "Sikkim tour",
    "Darjeeling tour",
    "Kerala backwaters",
    "Goa holiday",
    "Rajasthan tour",
    "Northeast India",
    "Thapa Holidays",
    "best travel agency India",
    "affordable tour packages",
    "India travel guide",
    "luxury tours India",
    "budget tours India",
    "cultural tours India",
    "adventure tours India",
    "holiday packages India",
  ],
  authors: [{ name: "Thapa Holidays" }],
  creator: "Thapa Holidays",
  publisher: "Thapa Holidays",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://thapaholidays.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Thapa Holidays",
    title: "Thapa Holidays - Best Travel Agency in India | Tour Packages",
    description:
      "Discover incredible India with Thapa Holidays. Book affordable tour packages to Sikkim, Darjeeling, Goa, Kerala, Rajasthan and more. 15+ years of excellence in travel.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thapa Holidays - Best Travel Agency in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thapa Holidays - Best Travel Agency in India | Tour Packages",
    description:
      "Discover incredible India with Thapa Holidays. Book affordable tour packages to Sikkim, Darjeeling, Goa, Kerala, Rajasthan and more.",
    images: ["/og-image.jpg"],
    creator: "@thapaholidays",
    site: "@thapaholidays",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Primary Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />

        {/* Android/Chrome Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon/android-chrome-512x512.png"
        />

        {/* Web App Manifest */}
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#0d9488" />
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />

        {/* Additional SEO Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Open Graph Additional Tags */}
        <meta property="og:site_name" content="Thapa Holidays" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="website" />

        {/* Twitter Additional Tags */}
        <meta name="twitter:site" content="@thapaholidays" />
        <meta name="twitter:creator" content="@thapaholidays" />

        {/* Additional Business Information */}
        <meta name="author" content="Thapa Holidays" />
        <meta name="publisher" content="Thapa Holidays" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />

        {/* Contact Information */}
        <meta name="contact" content="info@thapaholidays.com" />
        <meta name="reply-to" content="info@thapaholidays.com" />

        {/* Geo Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="geo.placename" content="India" />

        {/* Business Category */}
        <meta name="category" content="Travel & Tourism" />
        <meta name="classification" content="Travel Agency" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Providers>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
