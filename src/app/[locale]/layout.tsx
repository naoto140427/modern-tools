import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // 👈 修正: 1つ上でOKでした
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
  params: { locale: string };
}) {
  // paramsを非同期で解決
  const { locale } = await Promise.resolve(params);
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