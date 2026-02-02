"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { GripVertical } from "lucide-react";

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function CompareSlider({ beforeImage, afterImage, className = "" }: CompareSliderProps) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      x.set(containerRef.current.offsetWidth / 2);
    }
  }, [x]);

  const clipPath = useTransform(x, (value) => {
    return `inset(0 ${width - value}px 0 0)`;
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-ew-resize group ${className}`}
      onPointerMove={(e) => {
        // コンテナ内での相対座標を計算
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            x.set(newX);
        }
      }}
      // タッチデバイス対応
      onTouchMove={(e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newX = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
            x.set(newX);
        }
      }}
    >
      {/* Background (After / Result) - Checkerboard underlayer is assumed to be in parent or applied here */}
      <div className="absolute inset-0 bg-[url('/checker.png')] bg-repeat" />
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Foreground (Before / Original) */}
      <motion.div
        style={{ clipPath }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        style={{ x }}
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-active:scale-110">
           <GripVertical className="w-4 h-4 text-neutral-500" />
        </div>
      </motion.div>
    </div>
  );
}
