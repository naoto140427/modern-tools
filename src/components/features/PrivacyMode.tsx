"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/converter";

interface CleanedFile {
  originalName: string;
  blob: Blob;
  url: string;
  size: number;
}

interface Props {
  results: CleanedFile[];
  onClear: () => void;
}

export function PrivacyMode({ results, onClear }: Props) {
  const downloadAll = () => {
    results.forEach((res) => {
      const link = document.createElement("a");
      link.href = res.url;
      link.download = "clean_" + res.originalName;
      link.click();
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-4">
      
      <div className="flex items-center justify-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-2">
        <ShieldCheck className="w-6 h-6 text-green-400 mr-2" />
        <span className="text-green-100 font-medium">Metadata Removed & Secure</span>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {results.map((res, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                <img src={res.url} className="h-full w-full object-cover rounded opacity-80" alt="" />
              </div>
              <span className="truncate text-neutral-300 max-w-[150px]">{res.originalName}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs">
              {formatBytes(res.size)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
        <Button className="flex-[2] bg-green-600 hover:bg-green-700 text-white" onClick={(e) => { e.stopPropagation(); downloadAll(); }}>
          <Download className="mr-2 h-4 w-4" /> Download Clean Files
        </Button>
      </div>
    </motion.div>
  );
}