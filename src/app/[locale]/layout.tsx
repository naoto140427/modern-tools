import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // 👈 パスを修正しました
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SpotLight } from "@/components/hybrid/spot-light";
import { Header } from "@/components/hybrid/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModernTools",
  description: "Focus on Creation.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Next.js 15対応
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Header /> {/* 👈 ここに追加！！！ */}
          {children}
          <SpotLight /> {/* 👈 ここに追加！！ */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}