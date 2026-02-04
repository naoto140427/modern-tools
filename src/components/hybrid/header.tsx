"use client";

import { motion } from "framer-motion";
import { Zap, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ShareButton } from "@/components/shared/ShareButton";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      {/* ガラスの板 */}
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-3 shadow-2xl backdrop-blur-xl pointer-events-auto">
        
        {/* ロゴ部分 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:block">
            Lumina Studio
          </span>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/feedback" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            Feedback
          </Link>
        </nav>

        {/* 右側のコントロール */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <ShareButton />
          <Link href="/settings" className="p-2 text-neutral-400 hover:text-white transition-colors">
             <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}