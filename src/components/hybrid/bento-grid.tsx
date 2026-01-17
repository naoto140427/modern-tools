"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Crown, FileCode, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto p-4">
      
      {/* Card 1: プライバシー (横長) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:bg-white/10"
      >
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <ShieldCheck className="h-24 w-24 text-white/5 rotate-12" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wider uppercase">Privacy First</span>
          </div>
          <h3 className="text-2xl font-semibold text-white">Files never leave your device.</h3>
          <p className="text-neutral-400 max-w-sm">
            処理はすべてブラウザ（ローカル）で行われます。サーバーへのアップロードは一切発生しないため、機密データでも安心です。
          </p>
        </div>
      </motion.div>

      {/* Card 2: スピード (縦長) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-black p-8 backdrop-blur-md transition-all hover:border-blue-500/30"
      >
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wider uppercase">Zero Latency</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Instant Process</h3>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-bold text-white tracking-tighter">0.05s</div>
            <p className="text-sm text-neutral-500">Average conversion time</p>
          </div>
        </div>
      </motion.div>

      {/* Card 3: PDF Tools (Coming Soon を Ready に変更！) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
            {/* CrownアイコンをMergeアイコンなどに変更 */}
            <div className="h-6 w-6 text-red-500 flex items-center justify-center font-bold text-xs border border-red-500 rounded">PDF</div>
          </div>
          {/* Badgeを緑に変更 */}
          <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500 text-black uppercase animate-pulse">
            Active Now
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1">PDF Merge Ready</h3>
        <p className="text-sm text-neutral-400 mb-4">
          PDFファイルを複数ドラッグするだけで、瞬時に1つのファイルに結合します。
        </p>
        
        {/* ボタンも変更 */}
        <div className="w-full py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-neutral-300 flex items-center justify-center gap-2 cursor-default">
           Try dragging PDFs above ⬆
        </div>
      </motion.div>

      {/* Card 4: 技術スタック (装飾) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-md flex items-center justify-between"
      >
         <div className="space-y-1">
           <h3 className="text-lg font-semibold text-white">Powered by WebAssembly</h3>
           <p className="text-sm text-neutral-400">最新のブラウザ技術で、ネイティブアプリ並みの性能を。</p>
         </div>
         <FileCode className="h-10 w-10 text-neutral-700 group-hover:text-white transition-colors" />
      </motion.div>
    </div>
  );
}