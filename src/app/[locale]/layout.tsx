import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Tools",
  description: "Advanced tools for creators, running entirely in your browser.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  // 👇 ここを修正: Promise<{ locale: string }> に変更
  params: Promise<{ locale: string }>;
}) {
  // paramsをawaitして中身を取り出す
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}