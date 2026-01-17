"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, UploadCloud, Download, ArrowRight, Loader2, ImagePlus, FileArchive, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, formatBytes } from "@/lib/converter";
import { Button } from "@/components/ui/button";
import JSZip from "jszip"; // 👈 ZIPライブラリ

type ConversionResult = {
  originalName: string;
  newName: string;
  blob: Blob;
  url: string;
  originalSize: number;
  newSize: number;
};

export function CommandCenter() {
  const t = useTranslations("Hero");
  const [value, setValue] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]); // 👈 配列に変更

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // 画像以外をフィルタリング
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      alert("Please select image files!");
      return;
    }

    setIsConverting(true);
    // 前の結果があればクリアして新しく始める（または追加する仕様もアリだが今回はリセット）
    setResults([]);

    try {
      // ⏳ 演出用の待ち時間
      await new Promise(resolve => setTimeout(resolve, 500));

      // 🔥 並列処理で一気に変換！
      const conversionPromises = imageFiles.map(async (file) => {
        const data = await convertToWebP(file);
        return {
          originalName: file.name,
          newName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
          ...data
        };
      });

      const newResults = await Promise.all(conversionPromises);
      setResults(newResults);

    } catch (error) {
      console.error(error);
      alert("Some files failed to convert.");
    } finally {
      setIsConverting(false);
    }
  }, []);

  // ZIPダウンロード機能
  const downloadZip = useCallback(async () => {
    if (results.length === 0) return;

    const zip = new JSZip();
    
    // 画像をZIPに追加
    results.forEach((res) => {
      zip.file(res.newName, res.blob);
    });

    // ZIPを生成してダウンロード
    const content = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(content);
    
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = "converted_images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [results]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { 'image/*': [] },
    multiple: true // 👈 複数選択を許可！
  });

  // 合計削減サイズを計算
  const totalSaved = results.reduce((acc, curr) => acc + (curr.originalSize - curr.newSize), 0);
  const totalReductionPercent = results.length > 0 
    ? Math.round((totalSaved / results.reduce((acc, curr) => acc + curr.originalSize, 0)) * 100)
    : 0;

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
                <h3 className="text-2xl font-bold text-blue-100">Drop files here</h3>
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
                <p className="text-neutral-400">Processing multiple files...</p>
              </motion.div>
            )}

            {/* 結果表示 (リスト形式) */}
            {!isDragActive && !isConverting && results.length > 0 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg flex flex-col gap-4"
              >
                <div className="flex items-center justify-between text-sm text-neutral-400 px-2">
                  <span>{results.length} files converted</span>
                  <span className="text-green-400 font-bold">Saved {formatBytes(totalSaved)} (-{totalReductionPercent}%)</span>
                </div>

                {/* スクロール可能なリストエリア */}
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {results.map((res, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                           <img src={res.url} className="h-full w-full object-cover rounded opacity-80" alt="" />
                        </div>
                        <div className="truncate text-neutral-300 max-w-[120px] sm:max-w-[200px]" title={res.originalName}>
                          {res.originalName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-neutral-500 line-through text-xs">{formatBytes(res.originalSize)}</span>
                        <ArrowRight className="h-3 w-3 text-neutral-600" />
                        <span className="text-green-400 font-mono">{formatBytes(res.newSize)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2">
                  <Button 
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResults([]);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                  </Button>
                  
                  <Button 
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadZip();
                    }}
                  >
                    <FileArchive className="mr-2 h-4 w-4" /> Download ZIP
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 通常状態 */}
            {!isDragActive && !isConverting && results.length === 0 && (
              <motion.div
                key="normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-8 w-full"
              >
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

                <div className="sm:hidden w-full px-12">
                   <Button onClick={open} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                     <ImagePlus className="mr-2 h-4 w-4" /> Select Images
                   </Button>
                </div>

                <p className="text-xs text-neutral-500">
                   Batch processing supported (JPG, PNG)
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}