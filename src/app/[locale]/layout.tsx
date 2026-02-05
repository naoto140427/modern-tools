import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AdaptiveLayout } from "@/components/hybrid/AdaptiveLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://lumina-tools.com"),
  title: {
    default: "Lumina Studio | Privacy-First Browser Tools",
    template: "%s | Lumina Studio",
  },
  description: "Secure, serverless tools for image, video, PDF, and AI processing. 100% privacy-focused, running entirely in your browser.",
  verification: {
    google: "KBHcE7J1US7x_OwWaF_Fc9nVe-yHN6T2TrMgGA9l7-c",
  },
  keywords: ["image converter", "video compressor", "pdf merge", "serverless", "wasm", "privacy"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumina Studio",
  },
  alternates: {
    canonical: 'https://lumina-tools.com',
    languages: {
      'en': 'https://lumina-tools.com/en',
      'ja': 'https://lumina-tools.com/ja',
    },
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Lumina Studio",
  "url": "https://lumina-tools.com",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": "Image Converter, Video Editor, PDF Tools, AI Background Remover, Offline Capable",
  "description": "Privacy-first browser-based tools. No server uploads. Works offline."
};

export const viewport: Viewport = {
  themeColor: "#000000", // iOS status bar blends better with black
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // For notch support
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
          <AdaptiveLayout>
            {/* Persistent Background Layer moved inside AdaptiveLayout implicitly via CSS or here */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
              <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
              <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col pb-20 lg:pb-0">
               {/* Added padding bottom for mobile tab bar */}
               {children}
            </div>
          </AdaptiveLayout>
          <Analytics />
          <SpeedInsights />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
