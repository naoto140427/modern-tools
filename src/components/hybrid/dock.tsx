"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import {
  ImagePlus,
  FileText,
  ScanText,
  FileVideo,
  ShieldAlert,
  Code2,
  Music,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_MODES, AppMode } from "@/lib/constants";

interface DockProps {
  activeMode: AppMode | null;
  onAppClick: (mode: AppMode | null) => void;
  onSearchClick: () => void;
}

export function Dock({ activeMode, onAppClick, onSearchClick }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-max px-4 pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex h-16 items-end gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 backdrop-blur-2xl"
      >
        <DockIcon
          mouseX={mouseX}
          icon={Search}
          label="検索"
          onClick={onSearchClick}
        />

        <div className="h-10 w-px bg-white/10 self-center mx-1" />

        <DockIcon
          mouseX={mouseX}
          icon={ImagePlus}
          label="画像ツール"
          isActive={activeMode === APP_MODES.IMAGE}
          onClick={() => onAppClick(APP_MODES.IMAGE)}
        />
        <DockIcon
          mouseX={mouseX}
          icon={FileText}
          label="PDFツール"
          isActive={activeMode === APP_MODES.PDF}
          onClick={() => onAppClick(APP_MODES.PDF)}
        />
        <DockIcon
          mouseX={mouseX}
          icon={ScanText}
          label="OCR"
          isActive={activeMode === APP_MODES.OCR}
          onClick={() => onAppClick(APP_MODES.OCR)}
        />
        <DockIcon
          mouseX={mouseX}
          icon={FileVideo}
          label="動画ツール"
          isActive={activeMode === APP_MODES.VIDEO}
          onClick={() => onAppClick(APP_MODES.VIDEO)}
        />
        <DockIcon
          mouseX={mouseX}
          icon={Music}
          label="オーディオツール"
          isActive={activeMode === APP_MODES.AUDIO}
          onClick={() => onAppClick(APP_MODES.AUDIO)}
        />

        <div className="h-10 w-px bg-white/10 self-center mx-1" />

        <DockIcon
          mouseX={mouseX}
          icon={ShieldAlert}
          label="プライバシー"
          isActive={activeMode === APP_MODES.PRIVACY}
          onClick={() => onAppClick(APP_MODES.PRIVACY)}
        />
        <DockIcon
          mouseX={mouseX}
          icon={Code2}
          label="開発ツール"
          isActive={activeMode === APP_MODES.DEV}
          onClick={() => onAppClick(APP_MODES.DEV)}
        />
      </motion.div>
    </div>
  );
}

function DockIcon({
  mouseX,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  mouseX: MotionValue;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="group relative flex flex-col items-center justify-end">
        {/* ツールチップ */}
        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/10 pointer-events-none whitespace-nowrap">
            {label}
        </div>

      <motion.div
        ref={ref}
        style={{ width }}
        onClick={onClick}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center cursor-pointer transition-colors",
          isActive ? "bg-white/20 border-white/30" : "bg-white/5 border border-white/10 hover:bg-white/10"
        )}
      >
        <Icon className={cn("h-5 w-5 text-white", isActive && "text-blue-400")} />
      </motion.div>

      {/* アクティブドット */}
      <div className={cn("mt-1 h-1 w-1 rounded-full bg-white transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
    </div>
  );
}
