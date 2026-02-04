"use client";

import { NewsCategory, NewsPost } from "@/config/newsroom";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Filter Component
function FilterTabs({
  activeCategory,
  onCategoryChange
}: {
  activeCategory: NewsCategory | "all";
  onCategoryChange: (c: NewsCategory | "all") => void;
}) {
  const categories: (NewsCategory | "all")[] = ["all", "update", "guide", "tech"];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 capitalize relative",
              activeCategory === cat ? "text-black" : "text-neutral-400 hover:text-white"
            )}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/newsroom/${post.slug}`} className="group block mb-16 relative">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 w-full max-w-4xl">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                Latest Update
              </span>
              <span className="text-white/80 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
           </div>
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-purple-200 transition-colors">
             {post.title}
           </h2>
           <p className="text-lg text-neutral-300 max-w-2xl line-clamp-2 md:line-clamp-none">
             {post.excerpt}
           </p>
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ post, index }: { post: NewsPost; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/newsroom/${post.slug}`} className="block group h-full">
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors">
          <div className="aspect-video bg-neutral-800 relative overflow-hidden">
             <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
             <div className="absolute top-4 left-4">
               <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white capitalize">
                 {post.category}
               </span>
             </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
             <div className="text-xs text-neutral-500 mb-3">{post.date}</div>
             <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
               {post.title}
             </h3>
             <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
               {post.excerpt}
             </p>
             <div className="flex items-center text-xs font-medium text-purple-400 group-hover:translate-x-1 transition-transform w-fit">
               Read more <ArrowRight className="w-3.5 h-3.5 ml-1" />
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function NewsroomClient({ posts }: { posts: NewsPost[] }) {
  const [category, setCategory] = useState<NewsCategory | "all">("all");

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const filteredPosts = posts.filter(p => {
    // If featured post is displayed separately, maybe we exclude it from grid?
    // Apple Newsroom usually keeps latest on top and grid below.
    // Let's exclude the featured one from the grid if we are in "all" view,
    // but if filtering, show everything matching filter.
    if (category === "all") {
       return p.slug !== featuredPost.slug;
    }
    return p.category === category;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {category === "all" && <FeaturedCard post={featuredPost} />}

      <FilterTabs activeCategory={category} onCategoryChange={setCategory} />

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <NewsCard key={post.slug} post={post} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPosts.length === 0 && (
         <div className="text-center py-20 text-neutral-500">
            No articles found in this category.
         </div>
      )}
    </div>
  );
}
