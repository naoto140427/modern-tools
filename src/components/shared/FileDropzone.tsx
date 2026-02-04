"use client";

import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept: DropzoneOptions['accept'];
  maxFiles?: number;
  text: {
    active: string;
    idle: string;
    subtext: string;
  };
  className?: string;
}

export function FileDropzone({
  onDrop,
  accept,
  maxFiles = 1,
  text,
  className = ""
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  });

  // Animation spring configuration
  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={springTransition}
      className="w-full"
    >
      <Card
        {...getRootProps()}
        className={`
          relative overflow-hidden border-2 border-dashed
          h-96 flex flex-col items-center justify-center
          cursor-pointer transition-all duration-300
          backdrop-blur-2xl bg-white/5
          ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/10'}
          ${className}
        `}
      >
        <input {...getInputProps()} />
        <div className="z-10 flex flex-col items-center space-y-4 text-center p-6">
          <div className={`
            p-4 rounded-full bg-white/5 border border-white/10
            ${isDragActive ? 'animate-bounce' : ''}
          `}>
            <Upload className="w-8 h-8 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-1">
              {isDragActive ? text.active : text.idle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {text.subtext}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
