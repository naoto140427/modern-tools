import { blogPosts } from "@/lib/blog-posts";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const posts = blogPosts[locale] || blogPosts["en"] || [];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const posts = blogPosts[locale] || blogPosts["en"] || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <ArticleLayout>
      <Link href="/blog" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
           <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 uppercase tracking-wider">
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
             <Clock className="w-4 h-4" />
             {post.readTime}
          </div>
        </div>
      </header>

      {/* Main Content */}
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
              // Handle string content or string array content for list
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

            case "image":
              const imgSrc = block.src || (typeof block.content === 'string' ? block.content : '');
              if (!imgSrc) return null;
              return (
                <div key={i} className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={imgSrc} alt={block.alt || ''} className="w-full h-auto" />
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

      {/* CTA Section */}
      <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Try Image Lab Now
          </h2>
          <p className="text-neutral-300 mb-8 max-w-lg mx-auto">
            Convert, compress, and edit your images securely in your browser. No upload required.
          </p>
          <Link
            href="/tools/image"
            className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Open Image Lab
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </ArticleLayout>
  );
}
