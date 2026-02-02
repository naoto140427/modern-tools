"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  X,
  ChevronLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { CompareSlider } from "@/components/shared/CompareSlider";
import { useAiBackgroundRemover } from "@/hooks/useAiBackgroundRemover";

export default function AiLabPage() {
  const t = useTranslations("AILab");
  const {
    isReady,
    isLoading,
    isProcessing,
    progress,
    loadingStatus,
    error,
    result,
    loadModel,
    processImage,
    reset
  } = useAiBackgroundRemover();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // 初回マウント時にモデルロード開始
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    if (result) {
      url = URL.createObjectURL(result);
      if (active) {
        setResultUrl(url);
      }
    } else {
      if (active) {
        setResultUrl(null);
      }
    }

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [result]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // 自動的に処理開始
      processImage(file);
    }
  }, [processImage]);

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResultUrl(null);
    reset();
  };

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* ナビゲーションバック */}
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
        transition={springTransition}
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 flex items-center gap-3 max-w-2xl mx-auto backdrop-blur-md">
             <AlertCircle className="w-5 h-5 text-red-500" />
             <p>{error}</p>
          </div>
        )}

        {/* モデルロード中 */}
        {(isLoading || (!isReady && !error)) && (
           <div className="flex flex-col items-center justify-center p-24 space-y-8">
             <div className="relative">
               <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse" />
               <Sparkles className="w-16 h-16 text-purple-300 relative z-10 animate-bounce" />
             </div>
             <div className="space-y-2 text-center">
                <p className="text-white text-lg font-medium">{loadingStatus || t('loading.initializing')}</p>
                {progress > 0 && (
                  <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                )}
             </div>
           </div>
        )}

        {isReady && (
          <AnimatePresence mode="wait">
            {!selectedFile ? (
               <div className="max-w-3xl mx-auto">
                <FileDropzone
                  key="dropzone"
                  onDrop={handleDrop}
                  accept={{
                    'image/jpeg': [],
                    'image/png': [],
                    'image/webp': []
                  }}
                  text={{
                    idle: t('dropzone.idle'),
                    active: t('dropzone.active'),
                    subtext: t('dropzone.subtext')
                  }}
                  className="h-80 bg-black/40 border-purple-500/20 backdrop-blur-xl rounded-3xl hover:border-purple-500/50 transition-all"
                />
              </div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springTransition}
                className="max-w-5xl mx-auto"
              >
                <Card className="relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 rounded-3xl shadow-2xl min-h-[600px] flex flex-col">

                  {/* ツールバー */}
                  <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                    <div className="pointer-events-auto">
                       {/* Left controls if needed */}
                    </div>
                    <div className="pointer-events-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
                        className="rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* メインビュー */}
                  <div className="flex-1 relative flex items-center justify-center p-8">
                    {isProcessing ? (
                      <div className="text-center space-y-6">
                         <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
                            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400" />
                         </div>
                         <p className="text-xl font-light text-white animate-pulse">
                           {t('loading.processing')}
                         </p>
                      </div>
                    ) : (
                      resultUrl && previewUrl && (
                        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                           <CompareSlider
                             beforeImage={previewUrl}
                             afterImage={resultUrl}
                           />
                        </div>
                      )
                    )}
                  </div>

                  {/* アクションバー */}
                  {!isProcessing && resultUrl && (
                    <div className="p-6 border-t border-white/10 bg-white/5 flex justify-center">
                       <Button asChild className="h-14 px-8 text-base font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-105 active:scale-95">
                          <a href={resultUrl} download="removed-background.png">
                            <Download className="w-5 h-5 mr-2" />
                            {t('actions.download')}
                          </a>
                       </Button>
                    </div>
                  )}

                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
