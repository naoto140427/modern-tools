"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const VERSIONS = ["v1_1_0", "v1_0_0"];

export default function ChangelogPage() {
  const t = useTranslations("Changelog");

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
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("backButton")}
            </Button>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-neutral-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative border-l border-white/10 ml-4 space-y-12">
          {VERSIONS.map((version, i) => (
            <motion.div
              key={version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="ml-8 relative"
            >
              <div className="absolute -left-[41px] top-1 bg-[#050505] p-1">
                <div className="h-4 w-4 rounded-full bg-blue-500/20 border border-blue-500" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-neutral-500">
                  <span className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    {t(`versions.${version}.date`)}
                  </span>
                  <span className="flex items-center px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs">
                    <GitCommit className="mr-1.5 h-3 w-3" />
                    {version.replace(/v(\d+)_(\d+)_(\d+)/, "v$1.$2.$3")}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                    {t(`versions.${version}.title`)}
                  </h3>
                  <p className="text-neutral-400 text-base leading-relaxed">
                    {t(`versions.${version}.description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-neutral-600 text-sm pb-12 pt-12 border-t border-white/5">
          <p>© 2026 Modern Tools. Built for Creators.</p>
        </footer>

      </div>
    </div>
  );
}
