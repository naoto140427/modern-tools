"use client";

import React from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useTranslations } from "next-intl";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineIndicator() {
  const isOnline = useNetworkStatus();
  const t = useTranslations("Safety");

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-full shadow-lg pointer-events-auto">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-amber-500 leading-none mb-0.5">
                    {t('offline.title')}
                </span>
                <span className="text-[10px] text-amber-200/80 leading-none">
                    {t('offline.desc')}
                </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
