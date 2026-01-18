"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileVideo, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/converter";

interface VideoResult {
  originalName: string;
  originalSize: number;
  compressedBlob: Blob;
  compressedUrl: string;
  compressedSize: number;
}

interface Props {
  isProcessing: boolean;
  progress: number; // 0.0 ~ 1.0
  statusMessage: string;
  result: VideoResult | null;
  onClear: () => void;
}

export function VideoMode({ isProcessing, progress, statusMessage, result, onClear }: Props) {
  
  // ダウンロード処理
  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.compressedUrl;
    link.download = "compressed_" + result.originalName;
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-6 items-center">
      
      {/* 処理中の表示 */}
      {isProcessing && (
        <div className="w-full space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-blue-200 font-medium animate-pulse">{statusMessage}</span>
          </div>
          {/* プログレスバー */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500" 
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
              <p className="text-xs text-neutral-500 uppercase mb-1">Before</p>
              <p className="text-sm font-mono text-white">{formatBytes(result.originalSize)}</p>
            </div>
            <div className="h-px w-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xs text-blue-400 uppercase mb-1 font-bold">After</p>
              <p className="text-xl font-mono text-blue-400 font-bold">{formatBytes(result.compressedSize)}</p>
            </div>
          </div>
          
          <div className="text-center">
             <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
               Reduced by {Math.round((1 - result.compressedSize / result.originalSize) * 100)}%
             </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
            <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download MP4
            </Button>
          </div>
        </div>
      )}

    </motion.div>
  );
}