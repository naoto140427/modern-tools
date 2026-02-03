import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina Studio - Ultimate Serverless Creative Tools",
  description: "Convert images, videos, and PDFs entirely in your browser. No upload, privacy-focused, and free.",
  keywords: ["image converter", "video compressor", "pdf merge", "serverless", "wasm", "privacy"],
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-[#050505] text-white min-h-screen selection:bg-blue-500/30 overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          {/* Persistent Background Layer */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
            <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
          </div>

          <div className="relative z-10 min-h-screen flex flex-col">
             {children}
          </div>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
