import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Forge — 台灣本土化 React 元件庫",
  description:
    "Forge — 開源 React 元件庫，專為台灣本土化表單輸入打造。Open-source React components for Taiwan-localized form inputs: ROC date, TWID, tax ID, NHI card, license plate, phone, address, invoice. Zero deps. MIT.",
  metadataBase: new URL("https://forge.pgintel.dev"),
  openGraph: {
    title: "Forge — 台灣本土化 React 元件庫",
    description:
      "21 components, 11 validators, 169 passing tests. Zero runtime dependencies. MIT-licensed. Built for the Taiwan-localized form inputs every developer reimplements.",
    url: "https://forge.pgintel.dev",
    siteName: "Forge",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      suppressHydrationWarning
      className={`dark ${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
