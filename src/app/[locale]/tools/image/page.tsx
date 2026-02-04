import { Metadata } from "next";
import { seoData } from "@/lib/seo-data";
import ImageLabPage from "./client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = seoData.image[locale as keyof typeof seoData.image] || seoData.image.en;

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
  return <ImageLabPage />;
}
