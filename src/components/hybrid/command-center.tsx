"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, UploadCloud, Download, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, formatBytes } from "@/lib/converter"; // 👈 エンジンを読み込み
import { Button } from "@/components/ui/button";

export function CommandCenter() {
  const t = useTranslations("Hero");
  const [value, setValue] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  
  // 変換結果を入れる箱
  const [result, setResult] = useState<{ url: string; originalSize: number; newSize: number; name: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 画像以外なら弾く（今回は簡易的に）
    if (!file.type.startsWith("image/")) {
      alert("Please drop an image file!");
      return;
    }

    setIsConverting(true);
    setResult(null);

    try {
      // ⏳ 少し待たせる演出（速すぎるとユーザーが処理を感じられないため）
      await new Promise(resolve => setTimeout(resolve, 800));

      // 🔥 エンジン起動！
      const data = await convertToWebP(file);
      
      setResult({
        ...data,
        name: file.name.replace(/\.[^/.]+$/, "") + ".webp" // 拡張子をwebpに変更
      });
    } catch (error) {
      console.error(error);
      alert("Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { 'image/*': [] } // 画像のみ許可
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

        <div className="flex flex-col items-center justify-center py-16 px-6 text-center min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* パターン1: ドラッグ中 */}
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

            {/* パターン2: 変換中 */}
            {!isDragActive && isConverting && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <p className="text-neutral-400">Optimizing with Local AI...</p>
              </motion.div>
            )}

            {/* パターン3: 結果表示 (成功！) */}
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
                      e.stopPropagation(); // ドロップゾーン反応防止
                      setResult(null); // リセット
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
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

            {/* パターン4: 通常状態 (初期画面) */}
            {!isDragActive && !isConverting && !result && (
              <motion.div
                key="normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-8 w-full"
              >
                <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-inner">
                  <Sparkles className="h-10 w-10 text-white/80" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-semibold tracking-tight text-white">{t('title')}</h2>
                  <p className="text-neutral-400 text-lg">{t('subtitle')}</p>
                </div>

                <div className="relative w-full max-w-md group z-20">
                  <div className="relative flex items-center bg-neutral-900/80 border border-white/10 rounded-full px-4 py-3 shadow-lg focus-within:ring-2 focus-within:ring-white/20">
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
                    <div className="flex items-center gap-2 text-xs text-neutral-600 border border-white/10 rounded px-2 py-1 bg-black/20">
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </div>
                  </div>
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