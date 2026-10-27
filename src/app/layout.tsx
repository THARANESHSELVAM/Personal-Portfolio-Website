import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileProvider } from "@/context/ProfileContext";

import { getSiteUrl, SITE_METADATA } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#07090e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_METADATA.defaultTitle,
    template: SITE_METADATA.titleTemplate,
  },
  description: SITE_METADATA.description,
  applicationName: SITE_METADATA.siteName,
  keywords: [...SITE_METADATA.keywords],
  authors: [{ name: SITE_METADATA.authorName }],
  creator: SITE_METADATA.authorName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_METADATA.defaultTitle,
    description: SITE_METADATA.description,
    url: "/",
    siteName: SITE_METADATA.siteName,
    locale: SITE_METADATA.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.defaultTitle,
    description: SITE_METADATA.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-grid-pattern selection:bg-cyan-500/25 selection:text-cyan-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
