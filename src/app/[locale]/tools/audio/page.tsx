import { Metadata } from "next";
import { seoData } from "@/lib/seo-data";
import AudioLabPage from "./client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = seoData.audio[locale as keyof typeof seoData.audio] || seoData.audio.en;

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    openGraph: {
      title: t.title,
      description: t.description,
      type: "website",
    },
  };
}

export default function Page() {
  return <AudioLabPage />;
}
