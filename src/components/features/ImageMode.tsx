"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileArchive, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/converter";
import { ConversionResult, OutputFormat } from "@/lib/types";

interface Props {
  results: ConversionResult[];
  targetFormat: OutputFormat;
  onClear: () => void;
  onDownloadZip: () => void;
}

export function ImageMode({ results, targetFormat, onClear, onDownloadZip }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-neutral-400 px-2">
        <span>{results.length} images → {targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")}</span>
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
            <div className="flex items-center gap-2 text-green-400 font-mono">
              {formatBytes(res.newSize)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Clear</Button>
        <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.stopPropagation(); onDownloadZip(); }}>
          <FileArchive className="mr-2 h-4 w-4" /> Download ZIP
        </Button>
      </div>
    </motion.div>
  );
}