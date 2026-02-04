"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ChevronLeft,
  Github,
  ExternalLink,
  Mail
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FeedbackPage() {
  const t = useTranslations("Feedback");

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-2xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <MessageSquare className="w-8 h-8 text-pink-500" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 text-center">
                <h2 className="text-xl font-semibold text-white">{t('formTitle')}</h2>
                <p className="text-neutral-400">{t('formDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <Button
                    asChild
                    className="h-16 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex flex-col items-center justify-center gap-1 group"
                >
                    <a href="https://github.com/your-username/lumina-studio/issues" target="_blank" rel="noopener noreferrer">
                        <Github className="w-6 h-6 mb-1 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">{t('actions.github')}</span>
                    </a>
                </Button>

                <Button
                    asChild
                    className="h-16 bg-gradient-to-br from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-pink-900/20 group"
                >
                    <a href="https://docs.google.com/forms/u/0/" target="_blank" rel="noopener noreferrer">
                        <Mail className="w-6 h-6 mb-1 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">{t('actions.googleForm')}</span>
                    </a>
                </Button>
            </div>

            <div className="relative z-10 flex justify-center">
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {t('actions.send')}
                </p>
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
