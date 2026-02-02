"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Image as ImageIcon, Film, ArrowRight } from "lucide-react";

export function DashboardGrid() {
  const t = useTranslations("Dashboard");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Lumina Image Lab Card */}
      <Link href="/tools/image" className="block group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] h-full"
        >
          {/* Background Gradient Accent */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
            <div className="p-4 w-fit rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {t('ImageLab.title')}
                </h3>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-muted-foreground group-hover:text-white/70 transition-colors">
                {t('ImageLab.description')}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Lumina Video Lab Card */}
      <Link href="/tools/video" className="block group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/20 to-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] h-full"
        >
          {/* Background Gradient Accent */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all duration-500" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
            <div className="p-4 w-fit rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 group-hover:scale-110 transition-transform duration-300">
              <Film className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white group-hover:text-orange-200 transition-colors">
                  {t('VideoLab.title')}
                </h3>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-muted-foreground group-hover:text-white/70 transition-colors">
                {t('VideoLab.description')}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
