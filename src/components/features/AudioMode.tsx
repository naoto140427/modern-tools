"use client";
import React from "react";
import { motion } from "framer-motion";
import { Music, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/converter";

interface AudioResult {
  originalName: string;
  originalSize: number;
  convertedBlob: Blob;
  convertedUrl: string;
  convertedSize: number;
}

interface Props {
  isProcessing: boolean;
  progress: number;
  statusMessage: string;
  result: AudioResult | null;
  onClear: () => void;
}

export function AudioMode({ isProcessing, progress, statusMessage, result, onClear }: Props) {

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.convertedUrl;
    link.download = result.originalName.replace(/\.[^/.]+$/, "") + ".mp3";
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-6 items-center">

      {/* 処理中の状態 */}
      {isProcessing && (
        <div className="w-full space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            <span className="text-pink-200 font-medium animate-pulse">{statusMessage}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-center text-xs text-neutral-500 font-mono">{Math.round(progress * 100)}%</p>
        </div>
      )}

      {/* 結果表示 */}
      {!isProcessing && result && (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-xs text-neutral-500 uppercase mb-1">変換前</p>
              <p className="text-sm font-mono text-white">{formatBytes(result.originalSize)}</p>
            </div>
            <div className="h-px w-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xs text-pink-400 uppercase mb-1 font-bold">MP3</p>
              <p className="text-xl font-mono text-pink-400 font-bold">{formatBytes(result.convertedSize)}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm">
             <Music className="w-4 h-4" />
             <span className="truncate max-w-[200px]">{result.originalName}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>クリア</Button>
            <Button className="flex-[2] bg-pink-600 hover:bg-pink-700 text-white" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> MP3をダウンロード
            </Button>
          </div>
        </div>
      )}

    </motion.div>
  );
}
