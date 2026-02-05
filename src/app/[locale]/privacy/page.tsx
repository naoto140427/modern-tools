"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { privacyPolicy } from "@/config/privacy";
import { useParams } from "next/navigation";

export default function PrivacyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const policy = privacyPolicy[locale] || privacyPolicy["en"];

  // Simple Markdown-like parser for bold text
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-3xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 rounded-2xl mx-auto flex items-center justify-center border border-emerald-500/20"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              {locale === 'ja' ? '最終更新日' : 'Last Updated'}: <span className="text-neutral-300">{policy.lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {policy.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                {section.content.map((paragraph, j) => (
                  <p key={j}>
                    {formatText(paragraph)}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/10 text-center"
        >
            <p className="text-neutral-500 text-sm">
                Lumina Studio &copy; {new Date().getFullYear()}
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
