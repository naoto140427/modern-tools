"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, UploadCloud, Download, ArrowRight, Loader2, ImagePlus } from "lucide-react"; // ImagePlusを追加
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, formatBytes } from "@/lib/converter";
import { Button } from "@/components/ui/button";

export function CommandCenter() {
  const t = useTranslations("Hero");
  const [value, setValue] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<{ url: string; originalSize: number; newSize: number; name: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file!");
      return;
    }

    setIsConverting(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await convertToWebP(file);
      setResult({
        ...data,
        name: file.name.replace(/\.[^/.]+$/, "") + ".webp"
      });
    } catch (error) {
      console.error(error);
      alert("Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  }, []);

  // open関数を取り出す
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // 全体のクリックは無効化（検索窓のため）
    noKeyboard: true,
    accept: { 'image/*': [] }
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4" {...getRootProps()}>
      <input {...getInputProps()} />

      <motion.div
        layout
        className={cn(
          "relative overflow-hidden rounded-3xl border transition-all duration-500",
          isDragActive 
            ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105" 
            : "bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col items-center justify-center py-12 px-6 text-center min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* ドラッグ中 */}
            {isDragActive && (
              <motion.div
                key="drop"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="p-6 rounded-full bg-blue-500/20 border border-blue-500/30 animate-pulse">
                  <UploadCloud className="h-16 w-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-100">Release to Convert</h3>
              </motion.div>
            )}

            {/* 変換中 */}
            {!isDragActive && isConverting && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <p className="text-neutral-400">Optimizing...</p>
              </motion.div>
            )}

            {/* 結果表示 */}
            {!isDragActive && !isConverting && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-left">
                    <p className="text-xs text-neutral-500 mb-1">Original</p>
                    <p className="text-lg font-mono text-neutral-300">{formatBytes(result.originalSize)}</p>
                  </div>
                  <ArrowRight className="text-neutral-600" />
                  <div className="text-right">
                    <p className="text-xs text-green-400 mb-1">Optimized</p>
                    <p className="text-2xl font-bold text-green-400">{formatBytes(result.newSize)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-white text-black hover:bg-neutral-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResult(null);
                    }}
                  >
                    Clear
                  </Button>
                  <a 
                    href={result.url} 
                    download={result.name}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

            {/* 通常状態 */}
            {!isDragActive && !isConverting && !result && (
              <motion.div
                key="normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-8 w-full"
              >
                {/* 👇 ここをクリック可能に変更しました！ */}
                <div 
                  onClick={open}
                  className="relative h-24 w-24 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-inner cursor-pointer hover:border-white/30 transition-colors group/icon"
                >
                  <Sparkles className="h-8 w-8 text-white/80 mb-1 group-hover/icon:text-yellow-200 transition-colors" />
                  <span className="text-[10px] text-neutral-400 font-medium">TAP HERE</span>
                  <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl opacity-50 pointer-events-none" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white px-4">
                    {t('title')}
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-lg px-4">
                    {t('subtitle')}
                  </p>
                </div>

                {/* 検索バー */}
                <div className="relative w-full max-w-md group z-20 px-4">
                  <div className="relative flex items-center bg-neutral-900/80 border border-white/10 rounded-full px-4 py-3 shadow-lg transition-all focus-within:ring-2 focus-within:ring-white/20">
                    <Search className="h-5 w-5 text-neutral-500 mr-3" />
                    <input 
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600 h-full text-base"
                      onKeyDown={(e) => e.stopPropagation()} 
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 border border-white/10 rounded px-2 py-1 bg-black/20">
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </div>
                  </div>
                </div>

                {/* スマホ向けの明示的なボタン */}
                <div className="sm:hidden w-full px-12">
                   <Button onClick={open} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                     <ImagePlus className="mr-2 h-4 w-4" /> Select Image
                   </Button>
                </div>

                <p className="text-xs text-neutral-500">Supported: JPG, PNG → WebP</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}