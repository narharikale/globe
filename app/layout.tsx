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
  title: "Globetrotter Challenge",
  description: "Test your geography knowledge with this fun trivia game!",
  openGraph: {
    title: "Globetrotter Challenge",
    description: "Test your geography knowledge with this fun trivia game!",
    images: [
      {
        url: "/images/previewImage.webp",
        width: 1200,
        height: 630,
        alt: "Globetrotter Challenge Preview",
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "Globetrotter Challenge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Globetrotter Challenge",
    description: "Test your geography knowledge with this fun trivia game!",
    images: ["/images/previewImage.webp"],
    creator: "@globetrotter",
    site: "@globetrotter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
