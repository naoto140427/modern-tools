"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppWindowProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AppWindow({ children, title, isOpen, onClose, className }: AppWindowProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Apple風のスプリングイージング
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8 pointer-events-none"
        >
          <div
            className={cn(
              "pointer-events-auto relative w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e]/80 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5",
              className
            )}
          >
            {/* タイトルバー */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-4">
              <div className="flex items-center gap-2">
                <div className="group flex items-center justify-center h-3 w-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 cursor-pointer" onClick={onClose}>
                    <X className="h-2 w-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-white/90">
                {title}
              </div>

              <div className="w-16" /> {/* バランス調整用スペーサー */}
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-auto p-0 scrollbar-hide">
              {children}
            </div>
          </div>

          {/* 外側をクリックして閉じる (オーバーレイ) */}
          <div className="absolute inset-0 -z-10" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
