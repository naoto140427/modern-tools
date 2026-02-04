"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronLeft,
  FileArchive,
  Download,
  Plus,
  File,
  FolderArchive,
  Save,
  Eye,
  Archive as ArchiveIcon
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassTabs } from "@/components/shared/GlassTabs";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { useFileShelf } from "@/context/FileShelfContext";
import JSZip from "jszip";
import { toast } from "sonner";

export default function ArchiveLabPage() {
  const t = useTranslations("ArchiveLab");
  const { addItem } = useFileShelf();
  const [activeTab, setActiveTab] = useState("viewer"); // viewer | compressor

  // --- Viewer State ---
  const [viewingZip, setViewingZip] = useState<JSZip | null>(null);
  const [zipFiles, setZipFiles] = useState<{name: string, dir: boolean, date: Date}[]>([]);
  const [zipFileName, setZipFileName] = useState<string>("");

  // --- Compressor State ---
  const [filesToCompress, setFilesToCompress] = useState<File[]>([]);
  const [outputName, setOutputName] = useState("archive");

  // --- Logic ---

  const handleUnzipDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);
      setViewingZip(zip);
      setZipFileName(file.name);

      const files: {name: string, dir: boolean, date: Date}[] = [];
      zip.forEach((relativePath, zipEntry) => {
        files.push({
          name: zipEntry.name,
          dir: zipEntry.dir,
          date: zipEntry.date
        });
      });
      setZipFiles(files);
      toast.success("ZIP loaded successfully");
    } catch (e) {
      toast.error("Failed to load ZIP file");
      console.error(e);
    }
  }, []);

  const handleExtractAll = async () => {
    if (!viewingZip) return;

    // In a browser, extracting all usually means downloading them one by one or creating a new zip?
    // Usually "Extract" implies saving files. Since we can't save to disk folder directly,
    // we iterate and trigger downloads or add to shelf.
    // For this MVP, let's add extracted files to Shelf!

    let count = 0;
    const promises: Promise<void>[] = [];

    viewingZip.forEach((path, entry) => {
      if (!entry.dir) {
        promises.push(entry.async("blob").then(blob => {
           const fileName = entry.name.split('/').pop() || entry.name;
           // Workaround: if File constructor is not recognized, use Blob then cast (though File inherits Blob).
           // Or just treat as any to suppress if lib "dom" is not fully picking it up in this context.
           const file = new (File as any)([blob], fileName, { type: "application/octet-stream" });
           addItem(file, "Archive Lab");
           count++;
        }));
      }
    });

    await Promise.all(promises);
    toast.success(`Extracted ${count} files to Shelf`);
  };

  const handleCompressDrop = useCallback((acceptedFiles: File[]) => {
    setFilesToCompress((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const createZip = async (saveToShelf = false) => {
    if (filesToCompress.length === 0) return;

    const zip = new JSZip();
    filesToCompress.forEach(file => {
      zip.file(file.name, file);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const fileName = `${outputName || "archive"}.zip`;
    const file = new (File as any)([blob], fileName, { type: "application/zip" });

    if (saveToShelf) {
      addItem(file, "Archive Lab");
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const tabs = [
    { id: "viewer", label: t('tabs.viewer'), icon: <Eye className="w-4 h-4" /> },
    { id: "compressor", label: t('tabs.compressor'), icon: <ArchiveIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
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
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <Package className="w-8 h-8 text-amber-400" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
            <GlassTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <AnimatePresence mode="wait">
            {activeTab === "viewer" ? (
                <motion.div
                    key="viewer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                >
                    {!viewingZip ? (
                        <div className="max-w-2xl mx-auto h-80">
                            <FileDropzone
                                onDrop={handleUnzipDrop}
                                accept={{ 'application/zip': ['.zip'], 'application/x-zip-compressed': ['.zip'] }}
                                text={{
                                    idle: t('dropzone.idle'),
                                    active: t('dropzone.active'),
                                    subtext: t('dropzone.subtext')
                                }}
                                className="h-full bg-black/40 border-amber-500/20 backdrop-blur-xl rounded-3xl hover:border-amber-500/50 transition-all"
                            />
                        </div>
                    ) : (
                        <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-6 min-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                                        <FileArchive className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{zipFileName}</h2>
                                        <p className="text-xs text-neutral-400">{zipFiles.length} items</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => { setViewingZip(null); setZipFiles([]); }} className="border-white/10 hover:bg-white/10">
                                        Close
                                    </Button>
                                    <Button onClick={handleExtractAll} className="bg-amber-600 hover:bg-amber-500 text-white">
                                        {t('viewer.extractAll')}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {zipFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            {file.dir ? <FolderArchive className="w-5 h-5 text-amber-200" /> : <File className="w-5 h-5 text-neutral-400" />}
                                            <span className="text-sm text-neutral-200 truncate flex-1">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    key="compressor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                >
                    <div className="space-y-6">
                        <FileDropzone
                            onDrop={handleCompressDrop}
                            accept={{ 'application/octet-stream': [], 'image/*': [], 'video/*': [], 'text/*': [], 'application/pdf': [] }} // Accept mostly anything for compression
                            text={{
                                idle: t('dropzone.idle'),
                                active: t('dropzone.active'),
                                subtext: "Add files to compress"
                            }}
                            className="h-64 bg-black/40 border-amber-500/20 backdrop-blur-xl rounded-3xl hover:border-amber-500/50 transition-all"
                        />
                        <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-6">
                            <Label className="text-white mb-3 block pl-1">{t('compressor.fileName')}</Label>
                            <div className="flex gap-4">
                                <Input
                                    value={outputName}
                                    onChange={(e) => setOutputName(e.target.value)}
                                    placeholder="archive"
                                    className="bg-white/5 border-white/10 text-white h-12"
                                />
                                <div className="flex items-center justify-center bg-white/5 border border-white/10 px-4 rounded-md text-neutral-400 text-sm">
                                    .zip
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card className="bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl p-6 h-full min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium">Files to Compress ({filesToCompress.length})</h3>
                            {filesToCompress.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={() => setFilesToCompress([])} className="text-red-400 hover:text-red-300">
                                    Clear
                                </Button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 mb-6">
                            {filesToCompress.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-neutral-500 text-sm italic">
                                    No files added
                                </div>
                            ) : (
                                filesToCompress.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <File className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                            <span className="text-sm text-neutral-200 truncate">{f.name}</span>
                                        </div>
                                        <span className="text-xs text-neutral-500 ml-2">{(f.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => createZip(false)}
                                disabled={filesToCompress.length === 0}
                                className="h-12 bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {t('compressor.createZip')}
                            </Button>
                            <Button
                                onClick={() => createZip(true)}
                                disabled={filesToCompress.length === 0}
                                variant="outline"
                                className="h-12 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {t('actions.saveToShelf')}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
