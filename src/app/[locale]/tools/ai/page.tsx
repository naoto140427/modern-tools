import { Metadata } from "next";
import { seoData } from "@/lib/seo-data";
import AiLabPage from "./client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = seoData.ai[locale as keyof typeof seoData.ai] || seoData.ai.en;

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
  return <AiLabPage />;
}
