"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  FileText,
  Trash2,
  GripVertical,
  Download,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Plus
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { usePdfMerger } from "@/hooks/usePdfMerger";

interface PdfFile {
  id: string;
  file: File;
}

export default function PdfLabPage() {
  const t = useTranslations("PDFLab");
  const { isMerging, error, mergePdfs } = usePdfMerger();

  const [files, setFiles] = useState<PdfFile[]>([]);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setMergedBlobUrl(null); // 新しいファイルが追加されたら結果をリセット
  }, []);

  const handleRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedBlobUrl(null);
  };

  const handleClear = () => {
    setFiles([]);
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    setMergedBlobUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    const blob = await mergePdfs(files.map(f => f.file));
    if (blob) {
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    }
  };

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* ナビゲーションバック */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-6xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 flex items-center gap-3 max-w-2xl mx-auto backdrop-blur-md">
             <AlertCircle className="w-5 h-5 text-red-500" />
             <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 左側：ファイルリストと操作 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="min-h-[500px] bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden">

              {files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                   <FileDropzone
                     onDrop={handleDrop}
                     accept={{ 'application/pdf': ['.pdf'] }}
                     maxFiles={20}
                     text={{
                       idle: t('dropzone.idle'),
                       active: t('dropzone.active'),
                       subtext: t('dropzone.subtext')
                     }}
                     className="w-full h-full border-none bg-transparent hover:bg-white/5 transition-colors"
                   />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-sm font-medium text-neutral-400">
                      {t('fileList.count', { count: files.length })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-8"
                    >
                      {t('actions.clear')}
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[600px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
                      {files.map((item) => (
                        <Reorder.Item key={item.id} value={item}>
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing backdrop-blur-md"
                          >
                            <GripVertical className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400" />
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {item.file.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {(item.file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.id)}
                              className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-full w-8 h-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>

                  {/* 追加ドロップゾーン（小） */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                     <FileDropzone
                       onDrop={handleDrop}
                       accept={{ 'application/pdf': ['.pdf'] }}
                       maxFiles={20}
                       text={{
                         idle: "",
                         active: "",
                         subtext: ""
                       }}
                       className="h-16 border-dashed border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
                     />
                     <div className="absolute bottom-10 left-0 w-full flex items-center justify-center pointer-events-none">
                        <span className="flex items-center text-xs text-neutral-500 group-hover:text-neutral-300">
                           <Plus className="w-4 h-4 mr-2" />
                           {t('dropzone.subtext')}
                        </span>
                     </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* 右側：アクションパネル */}
          <div className="space-y-6">
            <Card className="p-8 space-y-8 backdrop-blur-xl bg-black/40 border-white/10 rounded-3xl shadow-xl sticky top-24">
               <div className="space-y-4">
                 <h2 className="text-xl font-semibold text-white">Summary</h2>
                 <div className="space-y-2 text-sm text-neutral-400">
                    <div className="flex justify-between py-2 border-b border-white/5">
                       <span>Files</span>
                       <span className="text-white">{files.length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                       <span>Total Size</span>
                       <span className="text-white">
                         {(files.reduce((acc, curr) => acc + curr.file.size, 0) / (1024 * 1024)).toFixed(2)} MB
                       </span>
                    </div>
                 </div>
               </div>

               <Button
                 className="w-full h-14 text-base font-semibold rounded-2xl shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-black hover:bg-white/90 disabled:opacity-50"
                 onClick={handleMerge}
                 disabled={files.length < 2 || isMerging}
               >
                 {isMerging ? (
                   <>
                     <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                     {t('actions.merging')}
                   </>
                 ) : (
                   <>
                     {mergedBlobUrl ? t('actions.download') : t('actions.merge')}
                   </>
                 )}
               </Button>

               {/* ダウンロードボタン（結合完了時） */}
               <AnimatePresence>
                 {mergedBlobUrl && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                   >
                      <Button asChild className="w-full h-14 text-base font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg mt-4">
                        <a href={mergedBlobUrl} download="merged-document.pdf">
                          <Download className="w-5 h-5 mr-2" />
                          {t('actions.download')}
                        </a>
                      </Button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </Card>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
