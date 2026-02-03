"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Languages,
  Check,
  RefreshCcw
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Manual reset logic since we don't have a complex state store yet besides standard browser storage
  const handleResetApp = async () => {
    try {
        localStorage.clear();
        sessionStorage.clear();
        // Clear IndexedDB if used (e.g. by idb-keyval or localforage if present, or just generic clear)
        const dbs = await window.indexedDB.databases();
        dbs.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
        });

        toast.success(t('data.cleared'));
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (e) {
        console.error("Reset failed", e);
        toast.error("Reset failed");
    }
  };

  const changeLanguage = (newLocale: "ja" | "en") => {
      router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-3xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <SettingsIcon className="w-8 h-8 text-neutral-400" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="space-y-6">
            {/* Theme */}
            <SettingSection title={t('theme.title')} desc={t('theme.desc')} icon={<Monitor className="w-5 h-5 text-purple-400" />}>
                <div className="grid grid-cols-3 gap-3">
                    <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')} label={t('theme.light')} icon={<Sun className="w-4 h-4" />} />
                    <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')} label={t('theme.dark')} icon={<Moon className="w-4 h-4" />} />
                    <ThemeButton active={theme === 'system'} onClick={() => setTheme('system')} label={t('theme.system')} icon={<Monitor className="w-4 h-4" />} />
                </div>
            </SettingSection>

            {/* Language */}
            <SettingSection title={t('language.title')} desc={t('language.desc')} icon={<Languages className="w-5 h-5 text-blue-400" />}>
                <div className="grid grid-cols-2 gap-3">
                    <ThemeButton active={locale === 'ja'} onClick={() => changeLanguage('ja')} label={t('language.ja')} />
                    <ThemeButton active={locale === 'en'} onClick={() => changeLanguage('en')} label={t('language.en')} />
                </div>
            </SettingSection>

            {/* Data */}
            <SettingSection title={t('data.title')} desc={t('data.desc')} icon={<Trash2 className="w-5 h-5 text-red-400" />}>
                <Button
                    variant="destructive"
                    onClick={handleResetApp}
                    className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 justify-start px-4"
                >
                    <RefreshCcw className="w-4 h-4 mr-3" />
                    {t('data.clear')}
                </Button>
            </SettingSection>
        </div>
      </motion.div>
    </div>
  );
}

function SettingSection({ title, desc, icon, children }: { title: string, desc: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-6 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        {icon}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">{title}</h3>
                        <p className="text-sm text-neutral-400 max-w-sm">{desc}</p>
                    </div>
                </div>
                <div className="w-full md:w-auto min-w-[200px]">
                    {children}
                </div>
            </div>
        </Card>
    )
}

function ThemeButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-all border
                ${active
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                }
            `}
        >
            {icon}
            {label}
        </button>
    )
}
