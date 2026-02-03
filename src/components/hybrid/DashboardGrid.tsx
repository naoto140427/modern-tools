"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Image as ImageIcon, Film, FileText, Sparkles, ArrowRight, Music } from "lucide-react";

export function DashboardGrid() {
  const t = useTranslations("Dashboard");

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const }
    },
    tap: {
      scale: 0.98
    }
  };

  const glowVariants = {
    hover: {
      opacity: 1,
      transition: { duration: 0.5 }
    },
    initial: {
      opacity: 0
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto p-4">
      {/* Lumina Image Lab Card */}
      <Link href="/tools/image" className="block group relative">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl h-64 flex flex-col justify-between shadow-2xl ring-1 ring-white/5"
        >
           <motion.div
             variants={glowVariants}
             className="absolute inset-0 rounded-3xl ring-1 ring-blue-500/50 z-20 pointer-events-none"
           />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">
                {t('ImageLab.title')}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                {t('ImageLab.description')}
              </p>
           </div>

           <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300">
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
           </div>
        </motion.div>
      </Link>

      {/* Lumina Video Lab Card */}
      <Link href="/tools/video" className="block group relative">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl h-64 flex flex-col justify-between shadow-2xl ring-1 ring-white/5"
        >
           <motion.div
             variants={glowVariants}
             className="absolute inset-0 rounded-3xl ring-1 ring-orange-500/50 z-20 pointer-events-none"
           />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 group-hover:shadow-orange-500/40 transition-shadow duration-300">
                <Film className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">
                {t('VideoLab.title')}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                {t('VideoLab.description')}
              </p>
           </div>

           <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
           </div>
        </motion.div>
      </Link>

      {/* Lumina PDF Lab Card */}
      <Link href="/tools/pdf" className="block group relative">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl h-64 flex flex-col justify-between shadow-2xl ring-1 ring-white/5"
        >
           <motion.div
             variants={glowVariants}
             className="absolute inset-0 rounded-3xl ring-1 ring-red-500/50 z-20 pointer-events-none"
           />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 mb-6 group-hover:shadow-red-500/40 transition-shadow duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">
                {t('PDFLab.title')}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                {t('PDFLab.description')}
              </p>
           </div>

           <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
           </div>
        </motion.div>
      </Link>

      {/* Lumina AI Magic Card */}
      <Link href="/tools/ai" className="block group relative">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl h-64 flex flex-col justify-between shadow-2xl ring-1 ring-white/5"
        >
           <motion.div
             variants={glowVariants}
             className="absolute inset-0 rounded-3xl ring-1 ring-purple-500/50 z-20 pointer-events-none"
           />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6 group-hover:shadow-purple-500/40 transition-shadow duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 tracking-tight mb-1">
                {t('AILab.title')}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                {t('AILab.description')}
              </p>
           </div>

           <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-500 transition-all duration-300">
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
           </div>
        </motion.div>
      </Link>

      {/* Lumina Audio Lab Card */}
      <Link href="/tools/audio" className="block group relative md:col-span-2">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl h-64 flex flex-col justify-between shadow-2xl ring-1 ring-white/5"
        >
           <motion.div
             variants={glowVariants}
             className="absolute inset-0 rounded-3xl ring-1 ring-emerald-500/50 z-20 pointer-events-none"
           />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
                <Music className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200 tracking-tight mb-1">
                {t('AudioLab.title')}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                {t('AudioLab.description')}
              </p>
           </div>

           <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
           </div>
        </motion.div>
      </Link>
    </div>
  );
}
