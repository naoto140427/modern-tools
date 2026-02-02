"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  FileVideo,
  ScanText,
  ShieldAlert,
  Code2,
  BookOpen,
  RefreshCw,
  Settings2,
  FileType,
  ImagePlus,
  FileText,
  Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_MODES, OUTPUT_FORMATS, AppMode, OutputFormat } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// コマンド定義
const COMMANDS = [
  { id: "image_mode", label: "画像変換ツール", icon: ImagePlus, shortcut: "I", mode: APP_MODES.IMAGE },
  { id: "pdf_mode", label: "PDFツール", icon: FileText, shortcut: "F", mode: APP_MODES.PDF },
  { id: "ocr_mode", label: "OCRテキスト抽出", icon: ScanText, shortcut: "O", mode: APP_MODES.OCR },
  { id: "video_mode", label: "動画圧縮ツール", icon: FileVideo, shortcut: "V", mode: APP_MODES.VIDEO },
  { id: "audio_mode", label: "オーディオ変換", icon: Music, shortcut: "A", mode: APP_MODES.AUDIO },
  { id: "privacy_mode", label: "プライバシー保護", icon: ShieldAlert, shortcut: "P", mode: APP_MODES.PRIVACY },
  { id: "dev_mode", label: "開発者ツール", icon: Code2, shortcut: "D", mode: APP_MODES.DEV },
  { id: "docs", label: "ドキュメントを開く", icon: BookOpen, shortcut: "" },
  { id: "settings", label: "設定切り替え", icon: Settings2, shortcut: "S" },
  { id: "format_webp", label: "出力をWebPに設定", icon: FileType, shortcut: "", format: OUTPUT_FORMATS.WEBP },
  { id: "format_jpg", label: "出力をJPGに設定", icon: FileType, shortcut: "", format: OUTPUT_FORMATS.JPEG },
  { id: "format_png", label: "出力をPNGに設定", icon: FileType, shortcut: "", format: OUTPUT_FORMATS.PNG },
];

interface CommandCenterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLaunchApp: (mode: AppMode) => void;
  onSettingsToggle: () => void;
  onFormatChange: (format: OutputFormat) => void;
}

export function CommandCenter({
  isOpen,
  onOpenChange,
  onLaunchApp,
  onSettingsToggle,
  onFormatChange
}: CommandCenterProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeCommand = useCallback((cmd: typeof COMMANDS[0]) => {
    onOpenChange(false);
    setSearchQuery("");

    setTimeout(() => {
      if (cmd.mode) {
        onLaunchApp(cmd.mode);
        toast(`${cmd.label} を起動しました`, { icon: <cmd.icon className="w-4 h-4" /> });
        return;
      }
      if (cmd.format) {
        onFormatChange(cmd.format);
        toast.success(`出力形式を ${cmd.format.split("/")[1].toUpperCase()} に設定しました`);
        return;
      }
      switch (cmd.id) {
        case "docs": router.push("/docs"); break;
        case "settings": onSettingsToggle(); break;
      }
    }, 100);
  }, [onLaunchApp, onFormatChange, onSettingsToggle, onOpenChange, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
        setSelectedIndex(0);
      }

      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
             executeCommand(filteredCommands[selectedIndex]);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          onOpenChange(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onOpenChange, executeCommand]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start pt-[20vh] justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#1e1e1e]/90 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-neutral-500"
                placeholder="コマンドを入力または検索..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                }}
              />
              <div className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded border border-white/5">ESC</div>
            </div>
            
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {filteredCommands.length === 0 ? (
                  <div className="p-4 text-center text-neutral-500 text-sm">コマンドが見つかりません。</div>
              ) : (
                  filteredCommands.map((cmd, index) => (
                    <div
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors",
                        index === selectedIndex ? "bg-blue-600/20 text-blue-100" : "text-neutral-300 hover:bg-white/5"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <cmd.icon className={cn("w-5 h-5", index === selectedIndex ? "text-blue-400" : "text-neutral-500")} />
                            <span className="text-sm font-medium">{cmd.label}</span>
                        </div>
                        {cmd.shortcut && (
                            <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded border font-mono",
                                index === selectedIndex ? "border-blue-500/30 bg-blue-500/20 text-blue-200" : "border-white/10 bg-white/5 text-neutral-500"
                            )}>
                                {cmd.shortcut}
                            </span>
                        )}
                    </div>
                  ))
              )}
            </div>

            <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-neutral-500">
                <span>選択</span>
                <div className="flex gap-2">
                    <span>↑↓ 移動</span>
                    <span>↵ 決定</span>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
