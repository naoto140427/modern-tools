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
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { useVideoConverter, VideoFormat } from "@/hooks/useVideoConverter";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<VideoFormat>("mp4");
  const [convertedBlobUrl, setConvertedBlobUrl] = useState<string | null>(null);

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
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        {!isLoaded && !error && (
           <div className="flex flex-col items-center justify-center p-24 space-y-6">
             <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
             <p className="text-neutral-400 text-lg font-light tracking-wide animate-pulse">{t('status.loading')}</p>
           </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/20 text-red-200 flex items-center gap-4 max-w-2xl mx-auto backdrop-blur-md">
             <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
             <p>{error}</p>
          </div>
        )}

        {isLoaded && (
          <AnimatePresence mode="wait">
            {!selectedFile ? (
               <div className="max-w-3xl mx-auto">
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
                  className="h-80 bg-black/40 border-white/10 backdrop-blur-xl rounded-3xl"
                />
              </div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={springTransition}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-6">
                   <Card className="relative p-8 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl min-h-[400px] shadow-2xl overflow-hidden">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <VideoIcon className="w-10 h-10 text-white/50" />
                      </div>
                      <p className="text-xl font-medium text-white mb-2">{selectedFile.name}</p>
                      <p className="text-sm text-neutral-500 font-mono bg-black/30 px-3 py-1 rounded-full border border-white/5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <div className="absolute top-6 right-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleResetAction}
                          disabled={isConverting}
                          className="rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* プログレスバー */}
                      {isConverting && (
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
                          <motion.div
                            className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
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
                        <Card className="p-6 bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between rounded-2xl backdrop-blur-md">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                              <Check className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium text-emerald-400 text-lg">{t('status.completed')}</p>
                              <p className="text-sm text-emerald-500/70">
                                {outputFormat.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20">
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

                <div className="space-y-4">
                   <Card className="p-8 space-y-8 backdrop-blur-xl bg-black/40 border-white/10 h-full rounded-3xl shadow-xl">
                      <div className="flex items-center space-x-3 text-white pb-6 border-b border-white/10">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                           <Settings2 className="w-5 h-5" />
                        </div>
                        <h2 className="font-semibold text-lg tracking-wide">{t('controls.outputFormat')}</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {(['mp4', 'webm'] as const).map((fmt) => (
                            <Button
                              key={fmt}
                              variant={outputFormat === fmt ? "default" : "outline"}
                              onClick={() => setOutputFormat(fmt)}
                              className={`
                                h-12 text-sm font-semibold transition-all duration-300 rounded-xl
                                ${outputFormat === fmt ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-900/20' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'}
                              `}
                            >
                              {fmt.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="pt-6 mt-auto">
                        <Button
                          className="w-full h-14 text-base font-semibold rounded-2xl shadow-xl shadow-orange-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-black hover:bg-white/90"
                          onClick={performConversion}
                          disabled={isConverting || !!convertedBlobUrl}
                        >
                          {isConverting ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                              {t('status.processing')} {progress}%
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5 mr-3" />
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
