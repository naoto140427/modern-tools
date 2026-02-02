"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ImagePlus,
  FileText,
  ScanText,
  FileVideo,
  ShieldAlert,
  Music,
  UploadCloud
} from "lucide-react";
import { Toaster, toast } from "sonner";
import JSZip from "jszip";
import QRCode from "qrcode";

import { Header } from "@/components/hybrid/header";
import { BentoGrid } from "@/components/hybrid/bento-grid";
import { Dock } from "@/components/hybrid/dock";
import { AppWindow } from "@/components/hybrid/app-window";
import { CommandCenter } from "@/components/hybrid/command-center";

import { ImageMode } from "@/components/features/ImageMode";
import { OcrMode } from "@/components/features/OcrMode";
import { PdfMode, QrMode, YoutubeMode } from "@/components/features/MiscModes";
import { DevMode } from "@/components/features/DevMode";
import { PrivacyMode } from "@/components/features/PrivacyMode";
import { VideoMode } from "@/components/features/VideoMode";
import { AudioMode } from "@/components/features/AudioMode";

import { APP_MODES, OUTPUT_FORMATS, AppMode, OutputFormat } from "@/lib/constants";
import { convertToWebP } from "@/lib/converter";
import { mergePDFs } from "@/lib/pdf-utils";
import { recognizeText } from "@/lib/ocr";
import { removeExif } from "@/lib/privacy";
import { videoProcessor } from "@/lib/video";
import { audioProcessor } from "@/lib/audio";
import { ConversionResult } from "@/lib/types";

export default function Home() {
  const t = useTranslations("Hero");

  // --- 状態管理 ---
  const [activeMode, setActiveMode] = useState<AppMode | null>(null);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState(0);

  // 設定
  const [quality, setQuality] = useState(0.8);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>(OUTPUT_FORMATS.WEBP);
  const [showSettings, setShowSettings] = useState(false);

  // 機能データステート
  const [imageResults, setImageResults] = useState<ConversionResult[]>([]);
  const [pdfResult, setPdfResult] = useState<{ url: string; count: number; filename: string } | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [privacyResults, setPrivacyResults] = useState<any[]>([]);
  const [videoResult, setVideoResult] = useState<any | null>(null);
  const [audioResult, setAudioResult] = useState<any | null>(null);

  // --- ハンドラー ---

  const handleOpenApp = (mode: AppMode | null) => {
    setActiveMode(mode);
    // アプリを開くときにステートをリセット
    setIsProcessing(false);
    setProgress(0);
    setStatusMessage("");
  };

  const handleCloseApp = () => {
    setActiveMode(null);
  };

  const handleClear = () => {
    setImageResults([]);
    setPdfResult(null);
    setOcrResult(null);
    setPrivacyResults([]);
    setVideoResult(null);
    setAudioResult(null);
    setIsProcessing(false);
    setProgress(0);
  };

  // --- ファイル処理ロジック ---

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0 || !activeMode) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("処理中...");

    try {
      if (activeMode === APP_MODES.IMAGE) {
        setStatusMessage("画像を変換中...");
        const promises = files.map(async (f) => {
          const data = await convertToWebP(f, quality, targetFormat);
          const ext = targetFormat === OUTPUT_FORMATS.JPEG ? ".jpg" : targetFormat === OUTPUT_FORMATS.PNG ? ".png" : ".webp";
          return { originalName: f.name, newName: f.name.replace(/\.[^/.]+$/, "") + ext, ...data };
        });
        const results = await Promise.all(promises);
        setImageResults(results);
        toast.success(`${results.length} 枚の画像を変換しました！`);
      }
      else if (activeMode === APP_MODES.PDF) {
         setStatusMessage("PDFを結合中...");
         const { blob, filename, count } = await mergePDFs(files);
         setPdfResult({ url: URL.createObjectURL(blob), filename, count });
         toast.success(`${count} つのPDFを結合しました！`);
      }
      else if (activeMode === APP_MODES.OCR) {
         setStatusMessage("テキストをスキャン中...");
         const text = await recognizeText(files[0], (p) => setProgress(p));
         setOcrResult(text);
         toast.success("テキストを抽出しました！");
      }
      else if (activeMode === APP_MODES.PRIVACY) {
         setStatusMessage("メタデータを削除中...");
         const promises = files.map(async (f) => {
          const blob = await removeExif(f);
          return { originalName: f.name, blob, url: URL.createObjectURL(blob), size: blob.size };
        });
        const results = await Promise.all(promises);
        setPrivacyResults(results);
        toast.success("メタデータを削除しました！");
      }
      else if (activeMode === APP_MODES.VIDEO) {
        setStatusMessage("エンジンを読み込み中...");
        await videoProcessor.load(() => {});
        setStatusMessage("動画を圧縮中...");
        const compressedBlob = await videoProcessor.compress(files[0], (p) => setProgress(p));
        setVideoResult({
          originalName: files[0].name,
          originalSize: files[0].size,
          compressedBlob,
          compressedUrl: URL.createObjectURL(compressedBlob),
          compressedSize: compressedBlob.size
        });
        toast.success("圧縮が完了しました！");
      }
      else if (activeMode === APP_MODES.AUDIO) {
        setStatusMessage("オーディオエンジンを読み込み中...");
        await audioProcessor.load(() => {});
        setStatusMessage("音声を変換中...");
        const convertedBlob = await audioProcessor.convertToMp3(files[0], (p) => setProgress(p));
        setAudioResult({
          originalName: files[0].name,
          originalSize: files[0].size,
          convertedBlob,
          convertedUrl: URL.createObjectURL(convertedBlob),
          convertedSize: convertedBlob.size
        });
        toast.success("変換が完了しました！");
      }
    } catch (e) {
      console.error(e);
      toast.error("処理中にエラーが発生しました。");
    } finally {
      setIsProcessing(false);
    }
  }, [activeMode, quality, targetFormat]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: processFiles,
    noClick: true,
    noKeyboard: true,
    disabled: !activeMode || activeMode === APP_MODES.DEV,
    accept: activeMode === APP_MODES.IMAGE ? { 'image/*': [], 'image/heic': ['.heic'] } :
            activeMode === APP_MODES.PDF ? { 'application/pdf': [] } :
            activeMode === APP_MODES.OCR ? { 'image/*': [] } :
            activeMode === APP_MODES.VIDEO ? { 'video/*': [] } :
            activeMode === APP_MODES.AUDIO ? { 'audio/*': [], 'video/*': [] } :
            activeMode === APP_MODES.PRIVACY ? { 'image/*': [] } : undefined
  });

  const downloadZip = useCallback(async () => {
    if (imageResults.length === 0) return;
    const zip = new JSZip();
    imageResults.forEach((res) => zip.file(res.newName, res.blob));
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(content); link.download = "converted_images.zip"; link.click();
    toast.success("ZIPをダウンロードしました！");
  }, [imageResults]);

  // --- レンダリングヘルパー ---

  const getWindowTitle = () => {
    switch (activeMode) {
      case APP_MODES.IMAGE: return "画像変換";
      case APP_MODES.PDF: return "PDFツール";
      case APP_MODES.OCR: return "OCRスキャナー";
      case APP_MODES.VIDEO: return "動画圧縮";
      case APP_MODES.PRIVACY: return "プライバシーガード";
      case APP_MODES.DEV: return "開発者ツール";
      case APP_MODES.AUDIO: return "オーディオツール";
      default: return "アプリ";
    }
  };

  const hasResults = () => {
    if (activeMode === APP_MODES.IMAGE) return imageResults.length > 0;
    if (activeMode === APP_MODES.PDF) return !!pdfResult;
    if (activeMode === APP_MODES.OCR) return !!ocrResult;
    if (activeMode === APP_MODES.VIDEO) return !!videoResult;
    if (activeMode === APP_MODES.AUDIO) return !!audioResult;
    if (activeMode === APP_MODES.PRIVACY) return privacyResults.length > 0;
    return false;
  };

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30 font-sans">
      <Toaster position="bottom-center" theme="dark" />
      
      {/* 背景の装飾 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <Header />

      {/* デスクトップコンテンツ */}
      <div className="relative z-10 flex flex-col items-center min-h-screen pt-24 pb-32 px-4 sm:px-8">
        
        {/* ウィジェットグリッド */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="w-full max-w-6xl"
        >
          <BentoGrid onLaunch={(mode) => handleOpenApp(mode)} />
        </motion.div>

      </div>

      {/* ドックナビゲーション */}
      <Dock
        activeMode={activeMode}
        onAppClick={handleOpenApp}
        onSearchClick={() => setShowCommandCenter(true)}
      />

      {/* Spotlight検索 */}
      <CommandCenter
        isOpen={showCommandCenter}
        onOpenChange={setShowCommandCenter}
        onLaunchApp={handleOpenApp}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onFormatChange={setTargetFormat}
      />

      {/* アクティブなアプリウィンドウ */}
      <AppWindow
        isOpen={!!activeMode}
        onClose={handleCloseApp}
        title={getWindowTitle()}
      >
        <div
          {...getRootProps()}
          className="h-full w-full flex flex-col items-center justify-center min-h-[400px] relative p-6"
        >
          <input {...getInputProps()} />

          {/* ドラッグオーバーレイ */}
          <AnimatePresence>
            {isDragActive && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-50 bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500 border-dashed rounded-xl flex flex-col items-center justify-center"
               >
                 <UploadCloud className="w-16 h-16 text-blue-200 animate-bounce" />
                 <p className="text-blue-100 font-bold text-xl mt-4">ファイルをここにドロップ</p>
               </motion.div>
            )}
          </AnimatePresence>

          {/* 読み込み状態 */}
          {isProcessing && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-neutral-400">{statusMessage}</p>
              {progress > 0 && (
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 空の状態 (ドロッププロンプト) */}
          {!isProcessing && !hasResults() && activeMode !== APP_MODES.DEV && (
            <div className="text-center space-y-4">
               <div
                 onClick={open}
                 className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/30 transition-all group shadow-2xl"
               >
                  {activeMode === APP_MODES.IMAGE && <ImagePlus className="w-10 h-10 text-neutral-400 group-hover:text-blue-400 transition-colors" />}
                  {activeMode === APP_MODES.PDF && <FileText className="w-10 h-10 text-neutral-400 group-hover:text-red-400 transition-colors" />}
                  {activeMode === APP_MODES.OCR && <ScanText className="w-10 h-10 text-neutral-400 group-hover:text-yellow-400 transition-colors" />}
                  {activeMode === APP_MODES.VIDEO && <FileVideo className="w-10 h-10 text-neutral-400 group-hover:text-blue-500 transition-colors" />}
                  {activeMode === APP_MODES.PRIVACY && <ShieldAlert className="w-10 h-10 text-neutral-400 group-hover:text-green-500 transition-colors" />}
                  {activeMode === APP_MODES.AUDIO && <Music className="w-10 h-10 text-neutral-400 group-hover:text-pink-500 transition-colors" />}
               </div>
               <div>
                 <h3 className="text-xl font-semibold text-white">
                    {activeMode === APP_MODES.IMAGE ? "画像をここにドロップ" :
                     activeMode === APP_MODES.PDF ? "PDFをドロップして結合" :
                     activeMode === APP_MODES.VIDEO ? "動画をドロップして圧縮" :
                     activeMode === APP_MODES.AUDIO ? "音声をドロップして変換" :
                     "ファイルをドラッグ＆ドロップ"}
                 </h3>
                 <p className="text-sm text-neutral-500 mt-2">またはクリックして選択</p>
               </div>
            </div>
          )}

          {/* 結果表示ビュー */}
          {!isProcessing && activeMode === APP_MODES.IMAGE && imageResults.length > 0 && (
            <ImageMode results={imageResults} targetFormat={targetFormat} onClear={handleClear} onDownloadZip={downloadZip} />
          )}
          {!isProcessing && activeMode === APP_MODES.PDF && pdfResult && (
            <PdfMode result={pdfResult} onClear={handleClear} />
          )}
          {!isProcessing && activeMode === APP_MODES.OCR && ocrResult && (
            <OcrMode text={ocrResult} onClear={handleClear} />
          )}
          {!isProcessing && activeMode === APP_MODES.VIDEO && videoResult && (
             <VideoMode isProcessing={false} progress={1} statusMessage="完了" result={videoResult} onClear={handleClear} />
          )}
          {!isProcessing && activeMode === APP_MODES.AUDIO && audioResult && (
             <AudioMode isProcessing={false} progress={1} statusMessage="完了" result={audioResult} onClear={handleClear} />
          )}
          {!isProcessing && activeMode === APP_MODES.PRIVACY && privacyResults.length > 0 && (
             <PrivacyMode results={privacyResults} onClear={handleClear} />
          )}

          {/* 開発者モード (ドロップゾーン不要) */}
          {activeMode === APP_MODES.DEV && (
            <DevMode onClear={handleCloseApp} />
          )}

        </div>
      </AppWindow>

    </main>
  );
}
