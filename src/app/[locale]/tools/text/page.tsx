"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Type,
  ChevronLeft,
  AlignLeft,
  ArrowRightLeft,
  Wand2,
  Copy,
  Check
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to check if exists, otherwise assume input or create
import { GlassTabs } from "@/components/shared/GlassTabs";
import { toast } from "sonner";

export default function TextLabPage() {
  const t = useTranslations("TextLab");
  const [activeTab, setActiveTab] = useState("counter");
  const [inputText, setInputText] = useState("");
  const [loremCount, setLoremCount] = useState(3);

  // --- Logic ---
  const stats = useMemo(() => {
    return {
      chars: inputText.length,
      words: inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length,
      lines: inputText.trim() === "" ? 0 : inputText.split(/\n/).length,
      noSpace: inputText.replace(/\s/g, "").length
    };
  }, [inputText]);

  const convertedText = useMemo(() => {
    return {
      upper: inputText.toUpperCase(),
      lower: inputText.toLowerCase(),
      fullToHalf: inputText.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)),
      halfToFull: inputText.replace(/[!-~]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0))
    };
  }, [inputText]);

  const generateLorem = () => {
    // Simple mock lorem ipsum for client-side
    const sentences = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];
    let result = "";
    for (let i = 0; i < loremCount; i++) {
        result += sentences[i % sentences.length] + " ";
    }
    setInputText(result.trim());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const tabs = [
    { id: "counter", label: t('tabs.counter'), icon: <AlignLeft className="w-4 h-4" /> },
    { id: "converter", label: t('tabs.converter'), icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: "generator", label: t('tabs.generator'), icon: <Wand2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-6xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <Type className="w-8 h-8 text-blue-400" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
            <GlassTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Area */}
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl h-[500px] flex flex-col">
                <Label className="text-white mb-3 pl-1">Input Text</Label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Type or paste here..."
                />
            </Card>

            {/* Result Area */}
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl h-[500px] overflow-y-auto">
                {activeTab === "counter" && (
                    <div className="grid grid-cols-2 gap-4 h-full content-start">
                        <StatCard label={t('counter.chars')} value={stats.chars} />
                        <StatCard label={t('counter.words')} value={stats.words} />
                        <StatCard label={t('counter.lines')} value={stats.lines} />
                        <StatCard label={t('counter.noSpace')} value={stats.noSpace} />
                    </div>
                )}

                {activeTab === "converter" && (
                    <div className="space-y-4">
                        <ConvertResult label={t('converter.upper')} value={convertedText.upper} onCopy={copyToClipboard} />
                        <ConvertResult label={t('converter.lower')} value={convertedText.lower} onCopy={copyToClipboard} />
                        <ConvertResult label={t('converter.fullToHalf')} value={convertedText.fullToHalf} onCopy={copyToClipboard} />
                        <ConvertResult label={t('converter.halfToFull')} value={convertedText.halfToFull} onCopy={copyToClipboard} />
                    </div>
                )}

                {activeTab === "generator" && (
                    <div className="h-full flex flex-col justify-center items-center space-y-8">
                        <div className="space-y-4 w-full max-w-xs">
                             <Label className="text-white">{t('generator.sentences')}: {loremCount}</Label>
                             <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setLoremCount(Math.max(1, loremCount - 1))}
                                    className="h-10 w-10 p-0 rounded-full border-white/20 bg-white/5 text-white"
                                >-</Button>
                                <span className="text-2xl font-mono text-blue-400">{loremCount}</span>
                                <Button
                                    variant="outline"
                                    onClick={() => setLoremCount(Math.min(20, loremCount + 1))}
                                    className="h-10 w-10 p-0 rounded-full border-white/20 bg-white/5 text-white"
                                >+</Button>
                             </div>
                        </div>
                        <Button
                            onClick={generateLorem}
                            className="w-full max-w-xs h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-900/20 text-base font-semibold"
                        >
                            <Wand2 className="w-5 h-5 mr-2" />
                            {t('generator.generate')}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2">
            <span className="text-neutral-400 text-sm font-medium">{label}</span>
            <span className="text-4xl font-mono font-bold text-white tracking-tight">{value.toLocaleString()}</span>
        </div>
    )
}

function ConvertResult({ label, value, onCopy }: { label: string, value: string, onCopy: (text: string) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{label}</span>
                <button onClick={() => onCopy(value)} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm break-all font-mono min-h-[3rem] flex items-center">
                {value || <span className="text-neutral-600 italic">No output</span>}
            </div>
        </div>
    )
}
