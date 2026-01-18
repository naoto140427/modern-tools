"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Command, Loader2, ImagePlus, ScanText, Settings2, X, QrCode, Youtube, FileType, RefreshCw, BookOpen, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { convertToWebP, OutputFormat } from "@/lib/converter";
import { mergePDFs } from "@/lib/pdf-utils";
import { recognizeText } from "@/lib/ocr"; 
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import JSZip from "jszip";
import QRCode from "qrcode";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mode, ConversionResult } from "@/lib/types";

// コンポーネントインポート
import { ImageMode } from "@/components/features/ImageMode";
import { OcrMode } from "@/components/features/OcrMode";
import { PdfMode, QrMode, YoutubeMode } from "@/components/features/MiscModes";
import { DevMode } from "@/components/features/DevMode";

// コマンドメニュー定義
const COMMANDS = [
  { id: "ocr_mode", label: "Switch to OCR Mode", icon: ScanText, shortcut: "O" },
  { id: "dev_mode", label: "Developer Tools", icon: Code2, shortcut: "D" },
  { id: "docs", label: "Open Documentation", icon: BookOpen, shortcut: "" },
  { id: "clear", label: "Reset / Clear All", icon: RefreshCw, shortcut: "Esc" },
  { id: "settings", label: "Toggle Settings", icon: Settings2, shortcut: "S" },
  { id: "format_webp", label: "Set Output to WebP", icon: FileType, shortcut: "" },
  { id: "format_jpg", label: "Set Output to JPG", icon: FileType, shortcut: "" },
  { id: "format_png", label: "Set Output to PNG", icon: FileType, shortcut: "" },
];

export function CommandCenter() {
  const t = useTranslations("Hero");
  const router = useRouter();
  
  // State
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [progress, setProgress] = useState(0); 
  const [quality, setQuality] = useState(0.8);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("image/webp");
  const [showSettings, setShowSettings] = useState(false);
  
  // 各モードの結果データ
  const [imageResults, setImageResults] = useState<ConversionResult[]>([]);
  const [pdfResult, setPdfResult] = useState<{ url: string; count: number; filename: string } | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [youtubeThumb, setYoutubeThumb] = useState<string | null>(null);

  // コマンドパレット
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- キーボード操作 ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
        setSelectedIndex(0);
      }
      if (showCommandPalette) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % COMMANDS.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + COMMANDS.length) % COMMANDS.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          setTimeout(() => executeCommand(COMMANDS[selectedIndex].id), 50);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setShowCommandPalette(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandPalette, selectedIndex]);

  const executeCommand = (id: string) => {
    setShowCommandPalette(false);
    setTimeout(() => {
      switch (id) {
        case "ocr_mode": setMode("ocr"); toast("Switched to OCR Mode", { icon: <ScanText className="w-4 h-4" /> }); break;
        case "dev_mode": setMode("dev"); toast("Developer Tools Activated", { icon: <Code2 className="w-4 h-4" /> }); break;
        case "docs": router.push("/docs"); break;
        case "clear": handleClear(); toast("Reset complete", { icon: <RefreshCw className="w-4 h-4" /> }); break;
        case "settings": setShowSettings((prev) => !prev); break;
        case "format_webp": setTargetFormat("image/webp"); toast.success("Output to WebP"); break;
        case "format_jpg": setTargetFormat("image/jpeg"); toast.success("Output to JPG"); break;
        case "format_png": setTargetFormat("image/png"); toast.success("Output to PNG"); break;
      }
    }, 100);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 入力監視
  useEffect(() => {
    if (mode === "image" || mode === "pdf" || mode === "ocr" || mode === "dev") return;
    if (!inputValue) {
      setMode(null); setQrCodeUrl(null); setYoutubeThumb(null); return;
    }
    const ytId = getYoutubeId(inputValue);
    if (ytId) {
      setMode("youtube");
      setYoutubeThumb(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
      return;
    }
    setMode("qr");
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(inputValue, { width: 400, margin: 2, color: { dark: qrColor, light: qrBgColor } });
        setQrCodeUrl(url);
      } catch (err) { console.error(err); }
    };
    const timer = setTimeout(generateQR, 300);
    return () => clearTimeout(timer);
  }, [inputValue, qrColor, qrBgColor, mode]);

  // ファイルドロップ処理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const isPDF = acceptedFiles[0].type === "application/pdf";
    const isImage = acceptedFiles[0].type.startsWith("image/") || acceptedFiles[0].name.toLowerCase().endsWith(".heic");

    if (!isPDF && !isImage) return;

    // OCRモード
    if (mode === "ocr") {
      if (!isImage) { toast.error("OCR supports images only."); return; }
      setInputValue("");
      setIsProcessing(true);
      setProgress(0);
      setOcrResult(null);
      try {
        const text = await recognizeText(acceptedFiles[0], (p: number) => setProgress(p));
        setOcrResult(text);
        toast.success("Text extracted!");
      } catch (e) { console.error(e); toast.error("OCR Failed."); } 
      finally { setIsProcessing(false); setProgress(0); }
      return;
    }

    // Devモード中はD&D無効（または通常モードへ移行）
    if (mode === "dev") {
       setMode(isPDF ? "pdf" : "image");
    }

    // 通常モード
    setInputValue("");
    setMode(isPDF ? "pdf" : "image");
    setIsProcessing(true);
    setImageResults([]);
    setPdfResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (isPDF) {
        const { blob, filename, count } = await mergePDFs(acceptedFiles);
        setPdfResult({ url: URL.createObjectURL(blob), filename, count });
        toast.success(`${count} PDFs merged!`);
      } else {
        const promises = acceptedFiles.map(async (file) => {
          const data = await convertToWebP(file, quality, targetFormat);
          const ext = targetFormat === "image/jpeg" ? ".jpg" : targetFormat === "image/png" ? ".png" : ".webp";
          return { originalName: file.name, newName: file.name.replace(/\.[^/.]+$/, "") + ext, ...data };
        });
        const results = await Promise.all(promises);
        setImageResults(results);
        toast.success(`${results.length} images converted!`);
      }
    } catch (e) { console.error(e); toast.error("Processing failed."); setMode(null); } 
    finally { setIsProcessing(false); }
  }, [quality, targetFormat, mode]);

  const downloadZip = useCallback(async () => {
    if (imageResults.length === 0) return;
    const zip = new JSZip();
    imageResults.forEach((res) => zip.file(res.newName, res.blob));
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(content); link.download = "converted_images.zip"; link.click();
    toast.success("ZIP Downloaded!");
  }, [imageResults]);

  const handleClear = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setMode(null); setInputValue(""); setImageResults([]); setPdfResult(null); setQrCodeUrl(null); setYoutubeThumb(null); setOcrResult(null);
    setShowCommandPalette(false);
  };
  
  const downloadImage = (url: string, name: string) => {
     const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop, noClick: true, noKeyboard: true,
    accept: { 'image/*': [], 'application/pdf': [], 'image/heic': ['.heic'] },
    multiple: true
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative" {...getRootProps()}>
      <Toaster position="bottom-center" theme="dark" />
      <input {...getInputProps()} />

      {/* Cmd+K Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCommandPalette(false)}>
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
               <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2"><Command className="w-4 h-4 text-neutral-400" /><span className="text-sm text-neutral-400 font-medium">Command Menu</span></div>
               <div className="p-2 space-y-1">
                 {COMMANDS.map((cmd, index) => (
                   <div key={cmd.id} onClick={() => executeCommand(cmd.id)} className={cn("flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors", index === selectedIndex ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-white/5")} onMouseEnter={() => setSelectedIndex(index)}>
                     <div className="flex items-center gap-3"><cmd.icon className="w-4 h-4" /><span className="text-sm">{cmd.label}</span></div>
                     {cmd.shortcut && (<span className={cn("text-xs px-1.5 py-0.5 rounded border", index === selectedIndex ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 text-neutral-500")}>{cmd.shortcut}</span>)}
                   </div>
                 ))}
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div layout className={cn("relative overflow-hidden rounded-3xl border transition-all duration-500", isDragActive ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105" : "bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl")}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Settings Button */}
        {(mode === "image" || mode === null) && (
          <div className="absolute top-4 right-4 z-30">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
              {showSettings ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="absolute top-16 right-4 left-4 sm:left-auto sm:w-64 bg-[#111] border border-white/10 rounded-2xl p-4 z-40 shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Output Format</span>
                  <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
                    {(["image/webp", "image/jpeg", "image/png"] as const).map((fmt) => (
                       <button key={fmt} onClick={() => setTargetFormat(fmt)} className={cn("flex-1 py-1.5 text-[10px] font-medium rounded transition-all", targetFormat === fmt ? "bg-blue-600 text-white shadow-lg" : "text-neutral-500 hover:text-white hover:bg-white/5")}>{fmt.split("/")[1].toUpperCase().replace("JPEG", "JPG")}</button>
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="space-y-3"><div className="flex justify-between items-center"><span className="text-xs font-bold text-white uppercase tracking-wider">Quality</span><span className="text-xs font-mono text-blue-400">{Math.round(quality * 100)}%</span></div><Slider defaultValue={[quality]} max={1.0} min={0.1} step={0.01} onValueChange={(vals) => setQuality(vals[0])} className="py-2" /></div>
                <div className="w-full h-px bg-white/10" /><div className="flex justify-center pt-2"><span className="text-[10px] text-neutral-600 font-mono tracking-widest opacity-50">v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center justify-center py-12 px-6 text-center min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Drag UI */}
            {isDragActive && (
              <motion.div key="drop" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center space-y-4">
                <div className="p-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 animate-pulse"><FileType className="h-16 w-16 text-indigo-400" /></div>
                <h3 className="text-2xl font-bold text-indigo-100">{mode === "ocr" ? "Drop Image to OCR" : "Convert Files"}</h3>
              </motion.div>
            )}

            {/* Loading UI */}
            {!isDragActive && isProcessing && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <p className="text-neutral-400">{mode === "ocr" ? "Reading Text (AI)..." : "Processing..."}</p>
                {mode === "ocr" && (<div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2"><motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} /></div>)}
              </motion.div>
            )}

            {/* Results */}
            {!isDragActive && !isProcessing && mode === "ocr" && ocrResult && <OcrMode text={ocrResult} onClear={handleClear} />}
            {!isDragActive && !isProcessing && mode === "image" && imageResults.length > 0 && <ImageMode results={imageResults} targetFormat={targetFormat} onClear={handleClear} onDownloadZip={downloadZip} />}
            {!isDragActive && !isProcessing && mode === "pdf" && pdfResult && <PdfMode result={pdfResult} onClear={handleClear} />}
            {!isDragActive && !isProcessing && mode === "youtube" && youtubeThumb && <YoutubeMode thumbUrl={youtubeThumb} onClear={handleClear} onDownload={() => downloadImage(youtubeThumb, "thumbnail.jpg")} />}
            {!isDragActive && !isProcessing && mode === "qr" && qrCodeUrl && <QrMode url={qrCodeUrl} color={qrColor} bgColor={qrBgColor} onColorChange={setQrColor} onBgColorChange={setQrBgColor} onClear={handleClear} />}
            
            {/* Dev Mode */}
            {!isDragActive && !isProcessing && mode === "dev" && <DevMode onClear={handleClear} />}

            {/* Default UI - 👇 ここを修正しました（disabledからdevを削除） */}
            {!isDragActive && !isProcessing && (!mode || mode === "qr" || mode === "youtube" || mode === "ocr") && (
              <motion.div key="normal" layout className={cn("flex flex-col items-center space-y-8 w-full", (mode === "qr" || mode === "youtube") ? "mt-8" : "")}>
                {(mode !== "qr" && mode !== "youtube") && (
                  <div onClick={open} className="relative h-24 w-24 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-inner cursor-pointer hover:border-white/30 transition-colors group/icon">
                    {mode === "ocr" ? <ScanText className="h-8 w-8 text-white/80 mb-1 group-hover/icon:text-yellow-200 transition-colors" /> : <Sparkles className="h-8 w-8 text-white/80 mb-1 group-hover/icon:text-yellow-200 transition-colors" />}
                    <span className="text-[10px] text-neutral-400 font-medium">{mode === "ocr" ? "DROP TO SCAN" : "TAP HERE"}</span>
                    <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl opacity-50 pointer-events-none" />
                  </div>
                )}
                
                {(mode !== "qr" && mode !== "youtube") && (
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white px-4">{mode === "ocr" ? "Extract Text (AI)" : t('title')}</h2>
                    <p className="text-neutral-400 text-sm sm:text-lg px-4">{mode === "ocr" ? "Drag & drop images to extract text instantly." : t('subtitle')}</p>
                  </div>
                )}

                <div className="relative w-full max-w-md group z-20 px-4">
                  <div className="relative flex items-center bg-neutral-900/80 border border-white/10 rounded-full px-4 py-3 shadow-lg transition-all focus-within:ring-2 focus-within:ring-white/20">
                    {mode === "youtube" ? <Youtube className="h-5 w-5 text-red-500 mr-3 animate-pulse" /> : 
                     mode === "qr" ? <QrCode className="h-5 w-5 text-green-400 mr-3 animate-pulse" /> : 
                     mode === "ocr" ? <ScanText className="h-5 w-5 text-blue-400 mr-3 animate-pulse" /> :
                     mode === "dev" ? <Code2 className="h-5 w-5 text-purple-500 mr-3 animate-pulse" /> :
                     <Search className="h-5 w-5 text-neutral-500 mr-3" />}
                    
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={mode === "ocr" ? "Switch back via Cmd+K" : "Type Text / Paste YouTube URL"}
                      className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600 h-full text-base"
                      onKeyDown={(e) => e.stopPropagation()} 
                      onClick={(e) => e.stopPropagation()}
                      autoFocus={(mode === "qr" || mode === "youtube")}
                      disabled={mode === "ocr"} 
                    />
                    
                    <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 border border-white/10 rounded px-2 py-1 bg-black/20 pointer-events-none">
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </div>
                  </div>
                </div>

                {(mode !== "qr" && mode !== "youtube") && (
                  <div className="sm:hidden w-full px-12">
                     <Button onClick={open} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                       {mode === "ocr" ? <ScanText className="mr-2 h-4 w-4" /> : <ImagePlus className="mr-2 h-4 w-4" />} Select Files
                     </Button>
                  </div>
                )}
                {(mode !== "qr" && mode !== "youtube") && <p className="text-xs text-neutral-500">Supports: Images, PDFs, HEIC, QR, YouTube</p>}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}