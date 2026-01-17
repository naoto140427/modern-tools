"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, UploadCloud, Download, ArrowRight, Loader2, ImagePlus, FileArchive, X, Trash2, FileText, Merge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, formatBytes } from "@/lib/converter";
import { mergePDFs } from "@/lib/pdf-utils"; // 👈 PDFエンジン追加
import { Button } from "@/components/ui/button";
import JSZip from "jszip";

// 型定義
type Mode = "image" | "pdf" | null;

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  
  // 結果ステート
  const [imageResults, setImageResults] = useState<ConversionResult[]>([]);
  const [pdfResult, setPdfResult] = useState<{ url: string; count: number; filename: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // 最初のファイルでモードを判定
    const firstType = acceptedFiles[0].type;
    const isPDF = firstType === "application/pdf";
    
    // 混ぜるな危険（画像とPDFが混ざってたらエラー）
    const isMixed = acceptedFiles.some(f => (isPDF ? f.type !== "application/pdf" : !f.type.startsWith("image/")));
    
    if (isMixed) {
      alert("Please upload only Images OR only PDFs, not both.");
      return;
    }

    setMode(isPDF ? "pdf" : "image");
    setIsProcessing(true);
    
    // リセット
    setImageResults([]);
    setPdfResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // 演出

      if (isPDF) {
        // --- PDF処理 ---
        const { blob, filename, count } = await mergePDFs(acceptedFiles);
        const url = URL.createObjectURL(blob);
        setPdfResult({ url, filename, count });
      } else {
        // --- 画像処理 ---
        const conversionPromises = acceptedFiles.map(async (file) => {
          const data = await convertToWebP(file);
          return {
            originalName: file.name,
            newName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
            ...data
          };
        });
        const results = await Promise.all(conversionPromises);
        setImageResults(results);
      }

    } catch (error) {
      console.error(error);
      alert("Processing failed.");
      setMode(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // ZIPダウンロード
  const downloadZip = useCallback(async () => {
    if (imageResults.length === 0) return;
    const zip = new JSZip();
    imageResults.forEach((res) => zip.file(res.newName, res.blob));
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "converted_images.zip";
    link.click();
  }, [imageResults]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { 
      'image/*': [], 
      'application/pdf': [] // PDFも許可！
    },
    multiple: true
  });

  // リセット処理
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode(null);
    setImageResults([]);
    setPdfResult(null);
  };

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
                <div className="p-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 animate-pulse">
                  <Merge className="h-16 w-16 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-100">Drop to Process</h3>
                <p className="text-indigo-300">Images → WebP | PDFs → Merge</p>
              </motion.div>
            )}

            {/* 処理中 */}
            {!isDragActive && isProcessing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <p className="text-neutral-400">
                  {mode === "pdf" ? "Merging PDFs..." : "Optimizing Images..."}
                </p>
              </motion.div>
            )}

            {/* 結果表示：PDFモード */}
            {!isDragActive && !isProcessing && mode === "pdf" && pdfResult && (
              <motion.div
                key="pdf-result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-6 w-full max-w-md"
              >
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <FileText className="h-12 w-12 text-red-400 mb-2 mx-auto" />
                  <h3 className="text-xl font-bold text-white">{pdfResult.count} PDFs Merged!</h3>
                </div>
                
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>
                    Clear
                  </Button>
                  <a href={pdfResult.url} download={pdfResult.filename} className="flex-[2]" onClick={(e) => e.stopPropagation()}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

            {/* 結果表示：画像モード */}
            {!isDragActive && !isProcessing && mode === "image" && imageResults.length > 0 && (
              <motion.div
                key="image-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg flex flex-col gap-4"
              >
                <div className="flex items-center justify-between text-sm text-neutral-400 px-2">
                  <span>{imageResults.length} images converted</span>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {imageResults.map((res, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                           <img src={res.url} className="h-full w-full object-cover rounded opacity-80" alt="" />
                        </div>
                        <span className="truncate text-neutral-300 max-w-[150px]">{res.originalName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 font-mono">
                         {formatBytes(res.newSize)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2">
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.stopPropagation(); downloadZip(); }}>
                    <FileArchive className="mr-2 h-4 w-4" /> Download ZIP
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 通常モード */}
            {!isDragActive && !isProcessing && !mode && (
              <motion.div
                key="normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-8 w-full"
              >
                <div onClick={open} className="relative h-24 w-24 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-inner cursor-pointer hover:border-white/30 transition-colors group/icon">
                  <Sparkles className="h-8 w-8 text-white/80 mb-1 group-hover/icon:text-yellow-200 transition-colors" />
                  <span className="text-[10px] text-neutral-400 font-medium">TAP HERE</span>
                  <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl opacity-50 pointer-events-none" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white px-4">{t('title')}</h2>
                  <p className="text-neutral-400 text-sm sm:text-lg px-4">{t('subtitle')}</p>
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
                     <ImagePlus className="mr-2 h-4 w-4" /> Select Files
                   </Button>
                </div>

                <p className="text-xs text-neutral-500">Supports: JPG, PNG → WebP / PDF → Merge</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}