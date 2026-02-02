"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  Download,
  RefreshCw,
  X,
  Settings2,
  Check,
  ChevronLeft
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { FileDropzone } from "@/components/shared/FileDropzone";

// Zodスキーマ定義
const ImageFormatSchema = z.union([
  z.literal("image/jpeg"),
  z.literal("image/png"),
  z.literal("image/webp"),
]);

const ImageDimensionsSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const ProcessingOptionsSchema = z.object({
  format: ImageFormatSchema,
  quality: z.number().min(0.1).max(1.0),
  dimensions: ImageDimensionsSchema.nullable(),
  shouldMaintainAspectRatio: z.boolean(),
});

type ImageDimensions = z.infer<typeof ImageDimensionsSchema>;
type ProcessingOptions = z.infer<typeof ProcessingOptionsSchema>;

export default function ImageLabPage() {
  const t = useTranslations("ImageLab");

  // 状態管理
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions | null>(null);

  // 設定状態
  const [options, setOptions] = useState<ProcessingOptions>({
    format: "image/png",
    quality: 0.9,
    dimensions: null,
    shouldMaintainAspectRatio: true,
  });

  // ファイルがドロップされた時の処理
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setProcessedImageUrl(null);

      const sourceImage = new Image();
      sourceImage.onload = () => {
        const dims = { width: sourceImage.width, height: sourceImage.height };

        // Zodで検証
        const result = ImageDimensionsSchema.safeParse(dims);
        if (result.success) {
          setOriginalDimensions(result.data);
          setOptions(prev => ({ ...prev, dimensions: result.data }));
        }
      };
      sourceImage.src = objectUrl;
    }
  }, []);

  const handleResetAction = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setOriginalDimensions(null);
  };

  const performImageConversion = async () => {
    const validationResult = ProcessingOptionsSchema.safeParse(options);
    if (!validationResult.success || !selectedFile || !previewUrl || !options.dimensions) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const drawingContext = canvas.getContext('2d');
        const sourceImage = new Image();

        sourceImage.onload = () => {
          if (!options.dimensions) return;

          canvas.width = options.dimensions.width;
          canvas.height = options.dimensions.height;

          if (drawingContext) {
            if (options.format === "image/jpeg") {
               drawingContext.fillStyle = "#FFFFFF";
               drawingContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            drawingContext.imageSmoothingEnabled = true;
            drawingContext.imageSmoothingQuality = "high";
            drawingContext.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL(options.format, options.quality);
            setProcessedImageUrl(dataUrl);
            setIsProcessing(false);
          }
        };

        sourceImage.src = previewUrl;
      } catch (error) {
        console.error("Image conversion failed:", error);
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleDimensionChange = (key: keyof ImageDimensions, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setOptions(prev => {
      if (!prev.dimensions || !originalDimensions) return prev;

      const newDimensions = { ...prev.dimensions, [key]: numValue };

      if (prev.shouldMaintainAspectRatio) {
        const ratio = originalDimensions.width / originalDimensions.height;
        if (key === 'width') {
          newDimensions.height = Math.round(numValue / ratio);
        } else {
          newDimensions.width = Math.round(numValue * ratio);
        }
      }

      const dimensionResult = ImageDimensionsSchema.safeParse(newDimensions);
      if (dimensionResult.success) {
         return { ...prev, dimensions: dimensionResult.data };
      }
      return prev;
    });
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

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <div className="max-w-3xl mx-auto">
               <FileDropzone
                 key="dropzone"
                 onDrop={handleDrop}
                 accept={{
                   'image/jpeg': [],
                   'image/png': [],
                   'image/webp': [],
                   'image/heic': []
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
                <Card className="relative overflow-hidden aspect-[4/3] flex items-center justify-center bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                  {previewUrl && (
                    <motion.img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-[90%] max-h-[90%] object-contain shadow-2xl rounded-lg"
                      layoutId="imagePreview"
                    />
                  )}
                  <div className="absolute top-6 right-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleResetAction}
                      className="rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>

                <AnimatePresence>
                  {processedImageUrl && (
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
                              {options.dimensions?.width} x {options.dimensions?.height} • {options.format.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20">
                          <a href={processedImageUrl} download={`converted-image.${options.format.split('/')[1]}`}>
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
                    <h2 className="font-semibold text-lg tracking-wide">{t('controls.convertFormat')}</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                      Format
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                        <Button
                          key={fmt}
                          variant={options.format === fmt ? "default" : "outline"}
                          onClick={() => setOptions(prev => ({ ...prev, format: fmt }))}
                          className={`
                            h-10 text-xs font-medium transition-all duration-300 rounded-xl
                            ${options.format === fmt ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'}
                          `}
                        >
                          {fmt.split('/')[1].toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {(options.format === 'image/jpeg' || options.format === 'image/webp') && (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center pl-1">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                          {t('controls.quality')}
                        </label>
                        <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md text-white/80">
                          {Math.round(options.quality * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[options.quality]}
                        min={0.1}
                        max={1.0}
                        step={0.05}
                        onValueChange={([val]) => setOptions(prev => ({ ...prev, quality: val }))}
                        className="py-2 cursor-pointer"
                      />
                    </div>
                  )}

                  <Separator className="bg-white/10" />

                  <div className="space-y-5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                      Resize
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-400 pl-1">{t('controls.width')}</label>
                        <Input
                          type="number"
                          value={options.dimensions?.width || ''}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          className="bg-black/30 border-white/10 h-10 text-sm font-mono text-white focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-400 pl-1">{t('controls.height')}</label>
                        <Input
                          type="number"
                          value={options.dimensions?.height || ''}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          className="bg-black/30 border-white/10 h-10 text-sm font-mono text-white focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>
                    </div>

                    <div
                      className="flex items-center space-x-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                      onClick={() => setOptions(prev => ({ ...prev, shouldMaintainAspectRatio: !prev.shouldMaintainAspectRatio }))}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 ${options.shouldMaintainAspectRatio ? 'bg-blue-600 border-blue-600' : 'border-neutral-600 group-hover:border-neutral-400'}`}>
                        {options.shouldMaintainAspectRatio && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm text-neutral-400 group-hover:text-white transition-colors select-none">{t('controls.maintainAspectRatio')}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-auto">
                    <Button
                      className="w-full h-14 text-base font-semibold rounded-2xl shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-black hover:bg-white/90"
                      onClick={performImageConversion}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          {t('status.processing')}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3" />
                          {t('actions.convert')}
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
