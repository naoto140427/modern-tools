"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, UploadCloud, Download, ArrowRight, Loader2, ImagePlus, FileArchive, Trash2, FileText, Merge, Settings2, X, QrCode, Youtube, ExternalLink } from "lucide-react"; // Youtubeアイコン追加
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, formatBytes } from "@/lib/converter";
import { mergePDFs } from "@/lib/pdf-utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import JSZip from "jszip";
import QRCode from "qrcode";

type Mode = "image" | "pdf" | "qr" | "youtube" | null;

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
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  
  const [quality, setQuality] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);

  const [imageResults, setImageResults] = useState<ConversionResult[]>([]);
  const [pdfResult, setPdfResult] = useState<{ url: string; count: number; filename: string } | null>(null);
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");

  // YouTube用ステート
  const [youtubeThumb, setYoutubeThumb] = useState<string | null>(null);

  // YouTube ID抽出ロジック
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 入力監視ロジック (Smart Input)
  useEffect(() => {
    // 1. ファイル処理中は無視
    if (mode === "image" || mode === "pdf") return;

    // 2. 空ならリセット
    if (!inputValue) {
      setMode(null);
      setQrCodeUrl(null);
      setYoutubeThumb(null);
      return;
    }

    // 3. YouTube URLか判定
    const ytId = getYoutubeId(inputValue);
    if (ytId) {
      setMode("youtube");
      // 最高画質のサムネURL
      setYoutubeThumb(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
      return;
    }

    // 4. それ以外ならQRコード
    setMode("qr");
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(inputValue, {
          width: 400,
          margin: 2,
          color: { dark: qrColor, light: qrBgColor }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(generateQR, 300);
    return () => clearTimeout(timer);

  }, [inputValue, qrColor, qrBgColor, mode]);

  // 画像ダウンロード用ヘルパー (CORS回避)
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // 失敗したら別タブで開く
      window.open(url, '_blank');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const firstType = acceptedFiles[0].type;
    const isPDF = firstType === "application/pdf";
    const isMixed = acceptedFiles.some(f => (isPDF ? f.type !== "application/pdf" : !f.type.startsWith("image/")));
    
    if (isMixed) {
      alert("Please upload only Images OR only PDFs.");
      return;
    }

    setInputValue("");
    setMode(isPDF ? "pdf" : "image");
    setIsProcessing(true);
    setImageResults([]);
    setPdfResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (isPDF) {
        const { blob, filename, count } = await mergePDFs(acceptedFiles);
        const url = URL.createObjectURL(blob);
        setPdfResult({ url, filename, count });
      } else {
        const conversionPromises = acceptedFiles.map(async (file) => {
          const data = await convertToWebP(file, quality);
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
  }, [quality]);

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
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: true
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode(null);
    setInputValue("");
    setImageResults([]);
    setPdfResult(null);
    setQrCodeUrl(null);
    setYoutubeThumb(null);
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

        {/* 設定ボタン (Imageモードのみ) */}
        {mode === "image" || mode === null ? (
          <div className="absolute top-4 right-4 z-30">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
            >
              {showSettings ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
            </Button>
          </div>
        ) : null}

        {/* 設定パネル */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-16 right-4 left-4 sm:left-auto sm:w-64 bg-[#111] border border-white/10 rounded-2xl p-4 z-20 shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Image Quality</span>
                  <span className="text-xs font-mono text-blue-400">{Math.round(quality * 100)}%</span>
                </div>
                <Slider
                  defaultValue={[quality]}
                  max={1.0}
                  min={0.1}
                  step={0.01}
                  onValueChange={(vals) => setQuality(vals[0])}
                  className="py-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <p className="text-neutral-400">Processing...</p>
              </motion.div>
            )}

            {/* 🔥 YouTubeモード */}
            {!isDragActive && mode === "youtube" && youtubeThumb && (
              <motion.div
                key="youtube-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-6 w-full max-w-md z-20"
              >
                <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={youtubeThumb} alt="YouTube Thumbnail" className="w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                
                <div className="flex gap-3 w-full">
                   <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>
                     Clear
                   </Button>
                   <Button 
                     className="flex-[2] bg-red-600 hover:bg-red-700 text-white"
                     onClick={(e) => {
                       e.stopPropagation();
                       downloadImage(youtubeThumb, "thumbnail.jpg");
                     }}
                   >
                     <Download className="mr-2 h-4 w-4" /> Download HD
                   </Button>
                 </div>
              </motion.div>
            )}

            {/* 🔥 QRコードモード */}
            {!isDragActive && mode === "qr" && qrCodeUrl && (
               <motion.div
               key="qr-result"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center space-y-6 w-full max-w-md z-20"
             >
               <div className="bg-white p-4 rounded-xl shadow-2xl">
                 <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg" />
               </div>
               
               <div className="flex gap-4 items-center bg-black/40 p-2 rounded-full border border-white/10" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-center">
                    <label className="text-[10px] text-neutral-400 mb-1">Color</label>
                    <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-center">
                    <label className="text-[10px] text-neutral-400 mb-1">Bg</label>
                    <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
                  </div>
               </div>

               <div className="flex gap-3 w-full">
                 <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>
                   Clear
                 </Button>
                 <a href={qrCodeUrl} download="qrcode.png" className="flex-[2]" onClick={(e) => e.stopPropagation()}>
                   <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                     <Download className="mr-2 h-4 w-4" /> Download PNG
                   </Button>
                 </a>
               </div>
             </motion.div>
            )}

            {/* 結果表示 (PDF) */}
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
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>Clear</Button>
                  <a href={pdfResult.url} download={pdfResult.filename} className="flex-[2]" onClick={(e) => e.stopPropagation()}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                  </a>
                </div>
              </motion.div>
            )}

            {/* 結果表示 (Image) */}
            {!isDragActive && !isProcessing && mode === "image" && imageResults.length > 0 && (
              <motion.div
                key="image-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg flex flex-col gap-4"
              >
                <div className="flex items-center justify-between text-sm text-neutral-400 px-2">
                  <span>{imageResults.length} images (Quality: {Math.round(quality * 100)}%)</span>
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
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={handleClear}>Clear</Button>
                  <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.stopPropagation(); downloadZip(); }}>
                    <FileArchive className="mr-2 h-4 w-4" /> Download ZIP
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 通常モード */}
            {!isDragActive && !isProcessing && (!mode || mode === "qr" || mode === "youtube") && (
              <motion.div
                key="normal"
                layout
                className={cn("flex flex-col items-center space-y-8 w-full", (mode === "qr" || mode === "youtube") ? "mt-8" : "")}
              >
                {(mode !== "qr" && mode !== "youtube") && (
                  <div onClick={open} className="relative h-24 w-24 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-inner cursor-pointer hover:border-white/30 transition-colors group/icon">
                    <Sparkles className="h-8 w-8 text-white/80 mb-1 group-hover/icon:text-yellow-200 transition-colors" />
                    <span className="text-[10px] text-neutral-400 font-medium">TAP HERE</span>
                    <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl opacity-50 pointer-events-none" />
                  </div>
                )}
                
                {(mode !== "qr" && mode !== "youtube") && (
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white px-4">{t('title')}</h2>
                    <p className="text-neutral-400 text-sm sm:text-lg px-4">{t('subtitle')}</p>
                  </div>
                )}

                <div className="relative w-full max-w-md group z-20 px-4">
                  <div className="relative flex items-center bg-neutral-900/80 border border-white/10 rounded-full px-4 py-3 shadow-lg transition-all focus-within:ring-2 focus-within:ring-white/20">
                    
                    {/* アイコン変化ロジック */}
                    {mode === "youtube" ? (
                      <Youtube className="h-5 w-5 text-red-500 mr-3 animate-pulse" />
                    ) : mode === "qr" ? (
                      <QrCode className="h-5 w-5 text-green-400 mr-3 animate-pulse" />
                    ) : (
                      <Search className="h-5 w-5 text-neutral-500 mr-3" />
                    )}
                    
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type Text / Paste YouTube URL"
                      className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600 h-full text-base"
                      onKeyDown={(e) => e.stopPropagation()} 
                      onClick={(e) => e.stopPropagation()}
                      autoFocus={(mode === "qr" || mode === "youtube")}
                    />
                  </div>
                </div>

                {(mode !== "qr" && mode !== "youtube") && (
                  <div className="sm:hidden w-full px-12">
                     <Button onClick={open} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                       <ImagePlus className="mr-2 h-4 w-4" /> Select Files
                     </Button>
                  </div>
                )}

                {(mode !== "qr" && mode !== "youtube") && <p className="text-xs text-neutral-500">Supports: Images, PDFs, QR (Text), YouTube</p>}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}