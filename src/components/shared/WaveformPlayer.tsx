"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

interface WaveformPlayerProps {
  file: File;
  onReady?: () => void;
  color?: string;
}

export function WaveformPlayer({ file, onReady, color = "#10b981" }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // WaveSurferの初期化
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(255, 255, 255, 0.2)',
      progressColor: color,
      cursorColor: 'rgba(255, 255, 255, 0.5)',
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 120,
      normalize: true,
      backend: 'WebAudio',
    });

    // ファイルの読み込み
    const url = URL.createObjectURL(file);
    ws.load(url);

    ws.on('ready', () => {
      setDuration(formatTime(ws.getDuration()));
      if (onReady) onReady();
    });

    ws.on('timeupdate', (currentTime) => {
      setCurrentTime(formatTime(currentTime));
    });

    ws.on('finish', () => {
      setIsPlaying(false);
    });

    wavesurfer.current = ws;

    return () => {
      ws.destroy();
      URL.revokeObjectURL(url);
    };
  }, [file, color, onReady]);

  const togglePlay = useCallback(() => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-medium truncate max-w-[200px] text-sm opacity-80">
          {file.name}
        </h3>
        <div className="font-mono text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded">
          {currentTime} / {duration}
        </div>
      </div>

      <div className="relative z-10 my-4" ref={containerRef} />

      <div className="flex justify-center relative z-10 mt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-neutral-200 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
