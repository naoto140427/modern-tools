"use client";
import React from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// PDF Result Component
export function PdfMode({ result, onClear }: { result: { url: string; count: number; filename: string }; onClear: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-6 w-full max-w-md">
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
        <FileText className="h-12 w-12 text-red-400 mb-2 mx-auto" />
        <h3 className="text-xl font-bold text-white">{result.count} PDFs Merged!</h3>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
        <a href={result.url} download={result.filename} className="flex-[2]" onClick={(e) => e.stopPropagation()}>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        </a>
      </div>
    </motion.div>
  );
}

// YouTube Result Component
export function YoutubeMode({ thumbUrl, onClear, onDownload }: { thumbUrl: string; onClear: () => void; onDownload: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-6 w-full max-w-md z-20">
      <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <img src={thumbUrl} alt="YouTube Thumbnail" className="w-full object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="flex gap-3 w-full">
         <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
         <Button className="flex-[2] bg-red-600 hover:bg-red-700 text-white" onClick={(e) => { e.stopPropagation(); onDownload(); }}>
           <Download className="mr-2 h-4 w-4" /> Download HD
         </Button>
       </div>
    </motion.div>
  );
}

// 👇 ここを修正：any をやめて、ちゃんと型を定義しました
interface QrProps {
  url: string;
  color: string;
  bgColor: string;
  onColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onClear: () => void;
}

// QR Result Component
export function QrMode({ url, color, bgColor, onColorChange, onBgColorChange, onClear }: QrProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-6 w-full max-w-md z-20">
      <div className="bg-white p-4 rounded-xl shadow-2xl">
        <img src={url} alt="QR Code" className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg" />
      </div>
      <div className="flex gap-4 items-center bg-black/40 p-2 rounded-full border border-white/10" onClick={(e) => e.stopPropagation()}>
         <div className="flex flex-col items-center">
           <label className="text-[10px] text-neutral-400 mb-1">Color</label>
           <input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
         </div>
         <div className="w-px h-8 bg-white/10" />
         <div className="flex flex-col items-center">
           <label className="text-[10px] text-neutral-400 mb-1">Bg</label>
           <input type="color" value={bgColor} onChange={(e) => onBgColorChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
         </div>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
        <a href={url} download="qrcode.png" className="flex-[2]" onClick={(e) => e.stopPropagation()}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white"><Download className="mr-2 h-4 w-4" /> Download PNG</Button>
        </a>
      </div>
    </motion.div>
  );
}