import { blogPosts } from "@/lib/blog-posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  // Get posts for current locale, fallback to English if not found
  const posts = blogPosts[locale] || blogPosts["en"] || [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 relative">
       <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
