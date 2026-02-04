"use client";

import { BlogPost } from "@/lib/blog-posts";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <article className="flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
          {/* Image Section */}
          <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900 border-b border-white/5">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
               src={post.image}
               alt={post.title}
               className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
               onError={(e) => {
                 // Fallback if image not found
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-purple-900/40', 'to-blue-900/40');
               }}
             />

             <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs font-medium text-white backdrop-blur-md uppercase tracking-wider">
                  {post.category}
                </span>
             </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-1 p-6 sm:p-8 gap-4">
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors tracking-tight line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>

            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
              Read article
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
