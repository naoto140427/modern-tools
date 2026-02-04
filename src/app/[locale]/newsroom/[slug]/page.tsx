import { newsPosts, NewsPost } from "@/config/newsroom";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, User, Share2, Sparkles, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import { ShareButton } from "@/components/shared/ShareButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const posts = newsPosts[locale] || newsPosts["en"] || [];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const posts = newsPosts[locale] || newsPosts["en"] || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current one, take 2)
  const relatedPosts = posts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <ArticleLayout>
      <nav className="flex items-center justify-between mb-8">
        <Link href="/newsroom" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Newsroom
        </Link>
        <div className="flex items-center gap-2">
           <span className="text-xs text-neutral-500 uppercase tracking-wider">Share</span>
           <ShareButton />
        </div>
      </nav>

      <header className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
           <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 uppercase tracking-wider">
             {post.category}
           </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-neutral-400 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4" />
             {post.date}
          </div>
          <div className="flex items-center gap-2">
             <User className="w-4 h-4" />
             Lumina Team
          </div>
        </div>
      </header>

      <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[21/9] relative group bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
      </div>

      <div className="space-y-8 text-neutral-300 leading-relaxed text-lg">
        {post.content.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return <p key={i}>{block.content}</p>;

            case "heading":
              const HeadingTag = `h${block.level || 2}` as React.ElementType;
              const sizeClass =
                block.level === 1 ? "text-3xl mt-12 mb-6 font-bold text-white" :
                block.level === 2 ? "text-2xl mt-12 mb-4 font-bold text-white" :
                "text-xl mt-8 mb-3 font-semibold text-white";
              return <HeadingTag key={i} className={sizeClass}>{block.content}</HeadingTag>;

            case "list":
               const items = Array.isArray(block.content)
                ? block.content
                : (typeof block.content === 'string' ? [block.content] : []);
              return (
                <ul key={i} className="list-disc list-inside space-y-2 pl-4 border-l-2 border-purple-500/30 bg-purple-500/5 py-4 rounded-r-xl">
                  {items.map((item, j) => (
                    <li key={j} className="text-neutral-200">{item}</li>
                  ))}
                </ul>
              );

             case "note":
                return (
                    <div key={i} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-base">
                        <span className="font-bold mr-2">Note:</span>
                        {block.content}
                    </div>
                );

            case "image":
              // For now, no real images, so we skip or render placeholder if src is present
              // But type allows src.
              if (!block.src) return null;
               return (
                <div key={i} className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={block.src} alt={block.alt || ''} className="w-full h-auto" />
                   {block.alt && <p className="text-center text-sm text-neutral-500 mt-2">{block.alt}</p>}
                </div>
              );

             case "code":
                return (
                    <pre key={i} className="bg-black/50 p-6 rounded-2xl overflow-x-auto border border-white/10 text-sm font-mono text-blue-300">
                        <code>{block.content}</code>
                    </pre>
                );

            default:
              return null;
          }
        })}
      </div>

      <hr className="my-16 border-white/5" />

      {relatedPosts.length > 0 && (
          <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white">Related News</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(p => (
                      <Link key={p.slug} href={`/newsroom/${p.slug}`} className="group block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                          <div className="text-xs text-neutral-500 mb-2">{p.date}</div>
                          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{p.title}</h4>
                          <div className="flex items-center text-xs font-medium text-purple-400 group-hover:translate-x-1 transition-transform">
                              Read <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}

    </ArticleLayout>
  );
}
