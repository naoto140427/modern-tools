"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChevronLeft,
  ServerOff,
  WifiOff,
  Code
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  const t = useTranslations("About");

  const features = [
    {
        icon: <ServerOff className="w-8 h-8 text-emerald-400" />,
        title: t('serverless.title'),
        desc: t('serverless.desc')
    },
    {
        icon: <WifiOff className="w-8 h-8 text-blue-400" />,
        title: t('offline.title'),
        desc: t('offline.desc')
    },
    {
        icon: <Code className="w-8 h-8 text-amber-400" />,
        title: t('openSource.title'),
        desc: t('openSource.desc')
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-4xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-900/40"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                >
                    <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-8 h-full hover:bg-white/5 transition-colors">
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit border border-white/5">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                        <p className="text-neutral-400 leading-relaxed text-sm">
                            {item.desc}
                        </p>
                    </Card>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center py-12 border-t border-white/10"
        >
            <p className="text-neutral-500 text-sm">
                Designed & Engineered by <span className="text-white font-medium">Jules</span> with precision.
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
