"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  text: string;
  onClear: () => void;
}

export function OcrMode({ text, onClear }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-4">
      <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-left max-h-[300px] overflow-y-auto custom-scrollbar shadow-inner relative group">
        <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap">{text}</pre>
        <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleCopy}>
           {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-white/5 border-white/10" onClick={onClear}>Close</Button>
        <Button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" /> Copy Text
        </Button>
      </div>
    </motion.div>
  );
}