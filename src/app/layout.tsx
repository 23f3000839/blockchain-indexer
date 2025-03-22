import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CustomClerkProvider } from "@/components/clerk-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "Solana Blockchain Indexer",
  description: "Index Solana blockchain data into your PostgreSQL database with Helius",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} dark:bg-gray-950 antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </CustomClerkProvider>
  );
}
