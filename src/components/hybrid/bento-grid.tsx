"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, FileText, Code2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_MODES, AppMode } from "@/lib/constants";

interface BentoGridProps {
  onLaunch: (mode: AppMode) => void;
}

export function BentoGrid({ onLaunch }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mx-auto p-4">
      
      {/* ウィジェット 1: プライバシーガード (ランチャー) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onLaunch(APP_MODES.PRIVACY)}
        className="cursor-pointer md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
          <ShieldCheck className="h-32 w-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
           <ArrowUpRight className="text-white/50" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wider uppercase">Privacy First</span>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-white mb-2">写真を安全に保護</h3>
            <p className="text-neutral-400 max-w-sm text-sm leading-relaxed">
              GPS位置情報やメタデータを即座に削除します。<br/>
              すべての処理はブラウザ内で完結します。
            </p>
          </div>
          <div className="inline-flex items-center text-xs font-medium text-white border border-white/20 rounded-full px-3 py-1 bg-white/5 group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-colors">
            タップして開く
          </div>
        </div>
      </motion.div>

      {/* ウィジェット 2: 動画ツール (ランチャー) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onLaunch(APP_MODES.VIDEO)}
        className="cursor-pointer group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-black p-8 backdrop-blur-md transition-all hover:border-blue-500/50 shadow-lg"
      >
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wider uppercase">Beta</span>
            </div>
            <h3 className="text-xl font-semibold text-white">動画圧縮</h3>
          </div>
          <div className="mt-8">
             <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-white tracking-tighter">80%</div>
                <div className="text-sm text-blue-300 mb-2">軽量化</div>
             </div>
            <p className="text-xs text-neutral-400 mt-1">品質を保ったままファイルサイズを削減。</p>
          </div>
        </div>
      </motion.div>

      {/* ウィジェット 3: PDFツール (ランチャー) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onLaunch(APP_MODES.PDF)}
        className="cursor-pointer group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-red-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
            <FileText className="h-6 w-6 text-red-500" />
          </div>
          <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase">
            Productivity
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-100 transition-colors">PDF結合</h3>
        <p className="text-sm text-neutral-400 mb-4">
          複数のドキュメントを瞬時に1つにまとめます。
        </p>
        
        <div className="w-full py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-neutral-300 flex items-center justify-center gap-2 group-hover:bg-red-500/10 group-hover:text-red-200 transition-colors">
           アプリを起動
        </div>
      </motion.div>

      {/* ウィジェット 4: システム情報 (静的リンク) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => onLaunch(APP_MODES.DEV)}
        className="cursor-pointer md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-md flex items-center justify-between hover:border-purple-500/30 transition-all"
      >
         <div className="space-y-1">
           <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              開発者ツール <Code2 className="w-4 h-4 text-purple-400" />
           </h3>
           <p className="text-sm text-neutral-400">JSONフォーマッター、Base64エンコード/デコード機能など。</p>
         </div>
         <div className="hidden sm:block px-4 py-2 rounded-full border border-white/10 bg-black/40 text-xs text-neutral-500 font-mono">
             v0.1.4-beta
         </div>
      </motion.div>
    </div>
  );
}
