import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from "@/components/hybrid/header";
import { SpotLight } from "@/components/hybrid/spot-light";

const inter = Inter({ subsets: ["latin"] });

// 👇 ここをガッツリ修正！
export const metadata: Metadata = {
  // ⚠️ 自分のVercelのURLに書き換えてください（末尾のスラッシュなし）
  metadataBase: new URL("https://modern-tools.vercel.app"), 

  title: {
    default: "ModernTools - Browser-based Image Converter & Optimizer",
    template: "%s | ModernTools"
  },
  description: "Securely convert JPG/PNG to WebP instantly in your browser. No server uploads required. 100% private, local AI-powered workspace for creators.",
  openGraph: {
    title: "ModernTools - The Ultimate Workspace for Creators",
    description: "Convert, optimize, and create with AI-powered tools directly in your browser.",
    url: 'https://modern-tools.vercel.app',
    siteName: 'ModernTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ModernTools - Browser-based Image Converter",
    description: "Convert JPG/PNG to WebP instantly. 100% Privacy Focused.",
  },
};
// 👆 ここまで

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <SpotLight />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}