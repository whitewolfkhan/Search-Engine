import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/hooks/use-i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROJAPOTI - AI-Powered Cybernetic Search Engine",
  description: "Next-generation AI-powered search engine with cyberpunk aesthetics and multilingual support.",
  keywords: ["PROJAPOTI", "প্রজাপতি", "AI", "search engine", "cyberpunk", "multilingual", "Next.js", "TypeScript"],
  authors: [{ name: "PROJAPOTI Team" }],
  openGraph: {
    title: "PROJAPOTI - AI-Powered Cybernetic Search Engine",
    description: "Next-generation AI-powered search engine with cyberpunk aesthetics",
    url: "https://projapoti.ai",
    siteName: "PROJAPOTI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PROJAPOTI - AI-Powered Cybernetic Search Engine",
    description: "Next-generation AI-powered search engine with cyberpunk aesthetics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
