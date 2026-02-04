"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Rocket,
  Home
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const t = useTranslations("Safety");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-black">
      {/* Background Stars */}
      <div className="absolute inset-0 z-0 opacity-50">
         <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse" />
         <div className="absolute top-[40%] right-[30%] w-1.5 h-1.5 bg-blue-200 rounded-full animate-ping" />
         <div className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-purple-200 rounded-full animate-pulse" />
         {/* More stars via CSS ideally, but this is a simple effect */}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[50px] animate-pulse" />
            <div className="relative z-10 w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                <Rocket className="w-20 h-20 text-white fill-white/10" />
            </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {t('notFound.title')}
            </h1>
            <p className="text-neutral-400 text-lg">
                {t('notFound.desc')}
            </p>
        </div>

        <Button asChild className="h-14 px-8 rounded-full bg-white text-black hover:bg-neutral-200 text-base font-semibold shadow-lg shadow-white/10">
            <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                {t('notFound.action')}
            </Link>
        </Button>
      </motion.div>
    </div>
  );
}
