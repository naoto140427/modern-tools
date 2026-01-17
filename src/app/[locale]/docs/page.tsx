"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileType, Youtube, QrCode, FileText, Command, Send, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: FileType,
    title: "Universal Converter",
    desc: "画像（JPG, PNG, WebP）はもちろん、iPhoneのHEIC写真もドラッグするだけで変換。画質やフォーマットも自由自在です。"
  },
  {
    icon: FileText,
    title: "PDF Merger",
    desc: "複数のPDFファイルをまとめてドラッグすれば、一瞬で1つのファイルに結合してダウンロードできます。"
  },
  {
    icon: QrCode,
    title: "Instant QR Generator",
    desc: "検索バーに文字やURLを入力するだけ。色変更可能なQRコードが即座に生成されます。"
  },
  {
    icon: Youtube,
    title: "YouTube Thumbnail",
    desc: "動画のURLをペーストすると、最高画質のサムネイルを自動で抽出して保存できます。"
  },
  {
    icon: Command,
    title: "Command Menu (⌘K)",
    desc: "マウスは不要です。Cmd + K (WinはCtrl + K) でメニューを開き、全ての設定へ瞬時にアクセスできます。"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "全てブラウザ内で処理されるため、サーバーへのアップロード時間はゼロ。プライバシーも完全に守られます。"
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white p-6 sm:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Link href="/" className="inline-block">
            <Button variant="ghost" className="text-neutral-400 hover:text-white -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Button>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-neutral-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Modern Toolsは、クリエイターの「面倒くさい」を瞬殺するために作られた、オールインワンの万能ユーティリティです。
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <f.icon className="h-8 w-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 text-center space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request a Feature</h2>
            <p className="text-neutral-400">
              「こんな機能が欲しい」「ここが使いにくい」など、あなたの声をお待ちしています。<br />
              このツールはユーザーと共に進化します。
            </p>
          </div>
          
          <a href="mailto:contact@example.com?subject=Modern Tools Feedback" className="inline-block">
            <Button size="lg" className="bg-white text-black hover:bg-neutral-200 font-semibold rounded-full px-8">
              <Send className="mr-2 h-4 w-4" /> Send Feedback
            </Button>
          </a>
        </motion.div>

        {/* Footer */}
        <footer className="text-center text-neutral-600 text-sm pb-12">
          <p>© 2026 Modern Tools. Built for Creators.</p>
        </footer>

      </div>
    </div>
  );
}