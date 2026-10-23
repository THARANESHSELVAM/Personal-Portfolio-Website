import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileProvider } from "@/context/ProfileContext";

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
  title: "Tharanesh Selvam | Aspiring Full-Stack Software Engineer — Portfolio",
  description:
    "Personal portfolio and engineering showcase of Tharanesh Selvam, built with Next.js, React, TypeScript, and Tailwind CSS. Open to student internship and entry-level software development opportunities.",
  keywords: [
    "Tharanesh Selvam",
    "Full-Stack Software Engineer",
    "Frontend Developer",
    "Software Engineering Intern",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Developer Portfolio",
  ],
  authors: [{ name: "Tharanesh Selvam" }],
  openGraph: {
    title: "Tharanesh Selvam | Aspiring Full-Stack Software Engineer",
    description:
      "Modern developer portfolio and project showcase built with Next.js, React, and TypeScript. Exploring student internship and entry-level software development opportunities.",
    url: "https://personal-portfolio-website-nine-lac.vercel.app",
    siteName: "Tharanesh Selvam Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharanesh Selvam | Aspiring Full-Stack Software Engineer",
    description:
      "Modern developer portfolio and project showcase built with Next.js, React, and TypeScript.",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-slate-100 bg-grid-pattern selection:bg-cyan-500/25 selection:text-cyan-200`}
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
