"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10" />
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-6 md:px-8"
      >
        {children}
      </motion.article>
    </div>
  );
}
