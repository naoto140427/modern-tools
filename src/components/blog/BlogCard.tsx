"use client";

import { BlogPost } from "@/types/blog";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

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
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-medium text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors tracking-tight">
              {post.title}
            </h3>

            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
              {post.description}
            </p>

            <div className="mt-auto pt-4 flex items-center text-xs font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
              Read article
              <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
