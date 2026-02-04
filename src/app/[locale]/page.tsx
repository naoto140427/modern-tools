"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Toaster } from "sonner";

import { Header } from "@/components/hybrid/header";
import { DashboardGrid } from "@/components/hybrid/DashboardGrid";
import { Footer } from "@/components/hybrid/Footer";

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30 font-sans flex flex-col">
      <Toaster position="bottom-center" theme="dark" />
      
      <Header />

      {/* デスクトップコンテンツ */}
      <div className="flex-1 relative z-10 flex flex-col items-center pt-32 pb-32 px-4 sm:px-8">
        
        {/* ヒーローセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-32 space-y-6 max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ダッシュボードグリッド */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="w-full"
        >
          <DashboardGrid />
        </motion.div>

      </div>

      <Footer />

    </main>
  );
}
