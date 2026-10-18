import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MYRESUME | Alex Chen — Principal Full-Stack Engineer & Cloud Architect",
  description:
    "Interactive portfolio, high-scale production case studies, verified skills matrix, and ATS-compliant resume hub for Alex Chen, Principal Full-Stack Engineer & Cloud Architect.",
  keywords: [
    "Principal Full-Stack Engineer",
    "Cloud Architect",
    "Distributed Systems",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Kubernetes",
    "Kafka",
    "ATS Resume",
    "Portfolio",
  ],
  authors: [{ name: "Alex Chen" }],
  openGraph: {
    title: "MYRESUME | Alex Chen — Principal Full-Stack Engineer & Cloud Architect",
    description:
      "Interactive portfolio, high-scale production case studies, and ATS-compliant resume hub.",
    url: "https://myresume-portfolio.example",
    siteName: "MYRESUME",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYRESUME | Alex Chen — Principal Full-Stack Engineer",
    description:
      "Interactive portfolio, high-scale production case studies, and ATS-compliant resume hub.",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 bg-grid-pattern selection:bg-cyan-500/20 selection:text-cyan-600 dark:selection:text-cyan-400`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
