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
  Check
} from "lucide-react";
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

/**
 * 画像処理ラボのメインページコンポーネント
 * Apple Human Interface Guidelinesに基づいたGlassmorphismデザインを採用
 */
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

        // Zodで検証（ランタイムチェック）
        const result = ImageDimensionsSchema.safeParse(dims);
        if (result.success) {
          setOriginalDimensions(result.data);
          setOptions(prev => ({ ...prev, dimensions: result.data }));
        }
      };
      sourceImage.src = objectUrl;
    }
  }, []);

  // リセット処理
  const handleResetAction = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setOriginalDimensions(null);
  };

  // 画像変換処理
  const performImageConversion = async () => {
    // 実行時バリデーション
    const validationResult = ProcessingOptionsSchema.safeParse(options);
    if (!validationResult.success || !selectedFile || !previewUrl || !options.dimensions) {
      console.error("Validation failed", validationResult.error);
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

  // サイズ変更ハンドラー
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

      // 入力中の値が一時的に不正（負など）になってもUI入力は許容したいが、
      // ここではZodでの検証を通ったものだけをセットする
      const dimensionResult = ImageDimensionsSchema.safeParse(newDimensions);
      if (dimensionResult.success) {
         return { ...prev, dimensions: dimensionResult.data };
      }
      return prev;
    });
  };

  // アニメーション設定 (Spring Physics)
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

        <AnimatePresence mode="wait">
          {!selectedFile ? (
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
              <div className="lg:col-span-2 space-y-4">
                <Card className="relative overflow-hidden aspect-video flex items-center justify-center bg-black/20 backdrop-blur-xl border-white/10">
                  {previewUrl && (
                    <motion.img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain shadow-2xl"
                      layoutId="imagePreview"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleResetAction}
                      className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md"
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
                      <Card className="p-4 bg-green-500/10 border-green-500/20 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-500/20 rounded-full">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-green-500">{t('status.completed')}</p>
                            <p className="text-xs text-muted-foreground">
                              {options.dimensions?.width} x {options.dimensions?.height} • {options.format.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full">
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
                <Card className="p-6 space-y-6 backdrop-blur-2xl bg-white/5 border-white/10 h-full">
                  <div className="flex items-center space-x-2 text-foreground/80 pb-4 border-b border-white/10">
                    <Settings2 className="w-5 h-5" />
                    <h2 className="font-medium">{t('controls.convertFormat')}</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                        <Button
                          key={fmt}
                          variant={options.format === fmt ? "default" : "outline"}
                          onClick={() => setOptions(prev => ({ ...prev, format: fmt }))}
                          className={`
                            text-xs h-9 transition-all duration-300
                            ${options.format === fmt ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-transparent border-white/10 hover:bg-white/5'}
                          `}
                        >
                          {fmt.split('/')[1].toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {(options.format === 'image/jpeg' || options.format === 'image/webp') && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {t('controls.quality')}
                        </label>
                        <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded">
                          {Math.round(options.quality * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[options.quality]}
                        min={0.1}
                        max={1.0}
                        step={0.05}
                        onValueChange={([val]) => setOptions(prev => ({ ...prev, quality: val }))}
                        className="py-2"
                      />
                    </div>
                  )}

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Resize
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-muted-foreground">{t('controls.width')}</label>
                        <Input
                          type="number"
                          value={options.dimensions?.width || ''}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          className="bg-black/20 border-white/10 h-9 text-sm font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-muted-foreground">{t('controls.height')}</label>
                        <Input
                          type="number"
                          value={options.dimensions?.height || ''}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          className="bg-black/20 border-white/10 h-9 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOptions(prev => ({ ...prev, shouldMaintainAspectRatio: !prev.shouldMaintainAspectRatio }))}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${options.shouldMaintainAspectRatio ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                        {options.shouldMaintainAspectRatio && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-xs text-muted-foreground select-none">{t('controls.maintainAspectRatio')}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Button
                      className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={performImageConversion}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          {t('status.processing')}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
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
