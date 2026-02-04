import { blogPosts } from "@/config/blog";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

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
           {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
                {tag}
              </span>
           ))}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-neutral-400 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4" />
             {post.date}
          </div>
          <div className="flex items-center gap-2">
             <User className="w-4 h-4" />
             {post.author}
          </div>
        </div>
      </header>

      <div className="space-y-8 text-neutral-300 leading-relaxed">
        {post.content.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return <p key={i} className="text-lg">{block.content}</p>;
            case "heading":
              const HeadingTag = `h${block.level}` as React.ElementType;
              // Simple mapping for sizing
              const sizeClass = block.level === 1 ? "text-3xl" : block.level === 2 ? "text-2xl mt-12 mb-4 text-white font-semibold" : "text-xl mt-8 mb-3 text-white font-medium";
              return <HeadingTag key={i} className={sizeClass}>{block.content}</HeadingTag>;
            case "list":
              return (
                <ul key={i} className="list-disc list-inside space-y-2 pl-4">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            case "image":
              // Assuming generic placeholder if src is local or remote
              return (
                <div key={i} className="my-8 rounded-2xl overflow-hidden border border-white/10">
                   <img src={block.src} alt={block.alt} className="w-full h-auto" />
                </div>
              );
             case "code":
                return (
                    <pre key={i} className="bg-black/50 p-4 rounded-xl overflow-x-auto border border-white/10 text-sm font-mono text-neutral-300">
                        <code>{block.code}</code>
                    </pre>
                )
            default:
              return null;
          }
        })}
      </div>
    </ArticleLayout>
  );
}
