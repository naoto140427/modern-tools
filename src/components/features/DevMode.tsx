"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Braces, Binary, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ToolType = "json" | "base64";

interface Props {
  onClear: () => void;
}

export function DevMode({ onClear }: Props) {
  const [activeTool, setActiveTool] = useState<ToolType>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // JSON整形処理
  const formatJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
      toast.success("JSON Formatted");
    } catch (e) {
      // 👇 ここを修正: anyを使わず安全にキャスト
      const message = e instanceof Error ? e.message : "Invalid JSON";
      setError(message);
      toast.error("Invalid JSON");
    }
  };

  // Base64処理
  const handleBase64 = (mode: "encode" | "decode") => {
    if (!input.trim()) return;
    try {
      const res = mode === "encode" ? btoa(input) : atob(input);
      setOutput(res);
      setError(null);
      toast.success(`Base64 ${mode === "encode" ? "Encoded" : "Decoded"}`);
    } catch {
      setError("Invalid Base64 string");
      toast.error("Conversion failed");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      
      {/* Header / Tabs */}
      <div className="flex items-center border-b border-white/10 bg-black/40 px-2">
        <button
          onClick={() => { setActiveTool("json"); setInput(""); setOutput(""); setError(null); }}
          className={cn("flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2", activeTool === "json" ? "border-blue-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
        >
          <Braces className="w-4 h-4" /> JSON
        </button>
        <button
          onClick={() => { setActiveTool("base64"); setInput(""); setOutput(""); setError(null); }}
          className={cn("flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2", activeTool === "base64" ? "border-purple-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
        >
          <Binary className="w-4 h-4" /> Base64
        </button>
        <div className="ml-auto pr-2">
          <Button variant="ghost" size="sm" onClick={onClear} className="text-neutral-500 hover:text-white h-8 w-8 p-0"><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
        
        {/* Input Area */}
        <div className="flex-1 flex flex-col p-4 gap-2">
          <label className="text-xs font-mono text-neutral-500 uppercase">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeTool === "json" ? '{"key": "value"}' : "Type text here..."}
            className="flex-1 bg-transparent resize-none outline-none font-mono text-sm text-neutral-300 placeholder:text-neutral-700 custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {/* Actions & Output Area */}
        <div className="flex-1 flex flex-col bg-white/5">
          {/* Action Bar */}
          <div className="p-2 border-b border-white/10 flex gap-2 justify-end">
             {activeTool === "json" ? (
               <Button size="sm" onClick={formatJSON} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">Format JSON</Button>
             ) : (
               <>
                 <Button size="sm" onClick={() => handleBase64("encode")} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">Encode</Button>
                 <Button size="sm" variant="outline" onClick={() => handleBase64("decode")} className="bg-transparent border-white/10 hover:bg-white/5 text-xs h-7">Decode</Button>
               </>
             )}
          </div>

          {/* Output Display */}
          <div className="flex-1 p-4 relative flex flex-col gap-2 overflow-hidden">
            <div className="flex justify-between items-center">
              <label className={cn("text-xs font-mono uppercase", error ? "text-red-500" : "text-green-500")}>
                {error ? "Error" : "Output"}
              </label>
              {output && (
                <button onClick={copyToClipboard} className="text-neutral-400 hover:text-white transition-colors">
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {error ? (
                <div className="text-red-400 font-mono text-sm break-all">{error}</div>
              ) : (
                <pre className="text-neutral-300 font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}