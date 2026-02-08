import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { texts } from "@/lib/texts/fa";

import "./globals.css";

const vazirmatn = Vazirmatn({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: texts.seo.title,
  description: texts.seo.description,
};

export const runtime = "nodejs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
