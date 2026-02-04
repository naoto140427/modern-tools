import { newsPosts } from "@/config/newsroom";
import { NewsroomClient } from "./NewsroomClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Newsroom - Lumina Studio",
    description: "Latest updates, guides, and tech insights from Lumina Studio.",
  };
}

export default async function NewsroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Get posts for current locale, fallback to English
  const posts = newsPosts[locale] || newsPosts["en"] || [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 relative">
       <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />

       <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Newsroom
          </h1>
          <p className="text-lg text-neutral-400">
            Latest updates, stories, and guides.
          </p>
       </header>

       <NewsroomClient posts={posts} />
    </div>
  );
}
