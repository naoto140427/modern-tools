"use client";

import { motion } from "framer-motion";
import { LocaleSwitcher } from "./locale-switcher";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4"
    >
      {/* ガラスの板 */}
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-3 shadow-2xl backdrop-blur-xl">
        
        {/* ロゴ部分 */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:block">
            Lumina Studio
          </span>
        </div>

        {/* ナビゲーション（今回はシンプルにGitHubリンクなどを想定） */}
        <nav className="flex items-center gap-6">
          <a href="#" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            Pricing
          </a>
        </nav>

        {/* 右側のコントロール */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <LocaleSwitcher />
        </div>
      </div>
    </motion.header>
  );
}