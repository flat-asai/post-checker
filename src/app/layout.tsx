import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Mail } from "lucide-react";
import Link from "next/link";
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
  title: "投稿まえにちょっとだけ考えることりすくん",
  description:
    "その言葉、伝わってるかな？ことりすくんは、投稿の前に、ちょっとだけ立ち止まるお手伝いをしています。",
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
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <small>
                ※このツールはAIによる投稿内容の簡易チェックを目的としたものであり、投稿の安全性やリスクを完全に保証するものではありません。最終的な判断はご自身の責任で行ってください。
              </small>
            </p>
          </header>
          <div className="flex-grow">{children}</div>
          <Analytics />

          <footer className="text-center text-xs text-gray-500 border-t border-gray-200">
            <p className="px-8 py-2">
              <Link href="https://x.com/kotoriskun" target="_blank">
                <span className="flex items-center justify-end">
                  <Mail className="inline-block mr-2 h-3 w-3" />
                  ご意見・ご要望はXまで
                </span>
              </Link>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
