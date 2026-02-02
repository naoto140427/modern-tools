"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  X,
  Settings2,
  Check,
  Video as VideoIcon,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { useVideoConverter, VideoFormat } from "@/hooks/useVideoConverter";

/**
 * 動画処理ラボのメインページ
 * サーバーレス(WASM)での動画変換機能を提供する。
 */
export default function VideoLabPage() {
  const t = useTranslations("VideoLab");
  const {
    isLoaded,
    isConverting,
    progress,
    error,
    loadFFmpeg,
    convertVideo
  } = useVideoConverter();

  // 状態管理
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<VideoFormat>("mp4");
  const [convertedBlobUrl, setConvertedBlobUrl] = useState<string | null>(null);

  // 初回マウント時にFFmpegをロード
  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setConvertedBlobUrl(null);
    }
  }, []);

  const handleResetAction = () => {
    if (convertedBlobUrl) URL.revokeObjectURL(convertedBlobUrl);
    setSelectedFile(null);
    setConvertedBlobUrl(null);
  };

  const performConversion = async () => {
    if (!selectedFile) return;

    const blob = await convertVideo({
      file: selectedFile,
      outputFormat
    });

    if (blob) {
      const url = URL.createObjectURL(blob);
      setConvertedBlobUrl(url);
    }
  };

  // アニメーション設定
  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center justify-center bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="w-full max-w-5xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground/90">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* FFmpegロード待機中 */}
        {!isLoaded && !error && (
           <div className="flex flex-col items-center justify-center p-12 space-y-4">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <p className="text-muted-foreground text-sm">{t('status.loading')}</p>
           </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
             <AlertCircle className="w-5 h-5" />
             <p>{error}</p>
          </div>
        )}

        {isLoaded && (
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <FileDropzone
                key="dropzone"
                onDrop={handleDrop}
                accept={{
                  'video/mp4': [],
                  'video/webm': [],
                  'video/quicktime': []
                }}
                text={{
                  idle: t('dropzone.idle'),
                  active: t('dropzone.active'),
                  subtext: t('dropzone.subtext')
                }}
              />
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={springTransition}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* 左側：動画プレビュー・ステータスエリア */}
                <div className="lg:col-span-2 space-y-4">
                   <Card className="relative p-8 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl border-white/10 min-h-[300px]">
                      <VideoIcon className="w-16 h-16 text-white/20 mb-4" />
                      <p className="text-lg font-medium text-foreground/90">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleResetAction}
                          disabled={isConverting}
                          className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* プログレスバー */}
                      {isConverting && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                          <motion.div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                          />
                        </div>
                      )}
                   </Card>

                   <AnimatePresence>
                    {convertedBlobUrl && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={springTransition}
                      >
                        <Card className="p-4 bg-green-500/10 border-green-500/20 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500/20 rounded-full">
                              <Check className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium text-green-500">{t('status.completed')}</p>
                              <p className="text-xs text-muted-foreground">
                                {outputFormat.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                            <a href={convertedBlobUrl} download={`converted.${outputFormat}`}>
                              <Download className="w-4 h-4 mr-2" />
                              {t('actions.download')}
                            </a>
                          </Button>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 右側：コントロールパネル */}
                <div className="space-y-4">
                   <Card className="p-6 space-y-6 backdrop-blur-2xl bg-white/5 border-white/10 h-full">
                      <div className="flex items-center space-x-2 text-foreground/80 pb-4 border-b border-white/10">
                        <Settings2 className="w-5 h-5" />
                        <h2 className="font-medium">{t('controls.outputFormat')}</h2>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {(['mp4', 'webm'] as const).map((fmt) => (
                            <Button
                              key={fmt}
                              variant={outputFormat === fmt ? "default" : "outline"}
                              onClick={() => setOutputFormat(fmt)}
                              className={`
                                text-sm h-10 transition-all duration-300
                                ${outputFormat === fmt ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-transparent border-white/10 hover:bg-white/5'}
                              `}
                            >
                              {fmt.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="pt-4 mt-auto">
                        <Button
                          className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          onClick={performConversion}
                          disabled={isConverting || !!convertedBlobUrl}
                        >
                          {isConverting ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                              {t('status.processing')} {progress}%
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5 mr-2" />
                              {t('controls.convert')}
                            </>
                          )}
                        </Button>
                      </div>
                   </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
