"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Toaster } from "sonner";

import { Header } from "@/components/hybrid/header";
import { DashboardGrid } from "@/components/hybrid/DashboardGrid";
import { Dock } from "@/components/hybrid/dock";

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30 font-sans">
      <Toaster position="bottom-center" theme="dark" />
      
      {/* 背景の装飾 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <Header />

      {/* デスクトップコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 pb-32 px-4 sm:px-8">
        
        {/* ヒーローセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ダッシュボードグリッド */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
           className="w-full"
        >
          <DashboardGrid />
        </motion.div>

      </div>

      {/* ドックナビゲーション（必要に応じて表示、今回はシンプルにするため一旦非表示にするか、ナビゲーション用として残す） */}
      {/*
        NOTE: Dockコンポーネントは本来アプリ内のナビゲーションやタスクスイッチングに使われる想定だが、
        現在はページ遷移型のアーキテクチャに移行したため、トップページでは装飾的、あるいは
        将来的な機能へのプレースホルダーとして機能する。
        今回は「トップページのUI構築」に集中するため、あえて表示を残しつつ、機能は制限する形をとる。
      */}
      {/* <Dock ... /> */}

    </main>
  );
}
