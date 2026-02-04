"use client";

import React, { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Settings2,
  Image as ImageIcon,
  ChevronLeft,
  X,
  QrCode
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function QRMasterPage() {
  const t = useTranslations("QRLab");
  const [text, setText] = useState("");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const qrRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const removeLogo = () => {
    if (logoUrl) {
      URL.revokeObjectURL(logoUrl);
      setLogoUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadQR = useCallback((format: "png" | "svg") => {
    if (!qrRef.current) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lumina-qr.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngFile;
            link.download = "lumina-qr.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation Back */}
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
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <QrCode className="w-8 h-8 text-cyan-500" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full">
            {/* Left Column: Controls */}
            <Card className="p-8 space-y-8 backdrop-blur-xl bg-black/40 border-white/10 rounded-3xl shadow-xl h-full">
                <div className="space-y-4">
                    <Label className="text-white text-base font-medium pl-1">Content</Label>
                    <Input
                        placeholder={t('inputPlaceholder')}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 h-14 text-lg rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-white text-sm font-medium pl-1">{t('controls.foreground')}</Label>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none p-0"
                            />
                            <span className="font-mono text-xs text-neutral-400 uppercase">{fgColor}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-sm font-medium pl-1">{t('controls.background')}</Label>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none p-0"
                            />
                            <span className="font-mono text-xs text-neutral-400 uppercase">{bgColor}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                     <Label className="text-white text-sm font-medium pl-1">{t('controls.logo')}</Label>
                     <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 h-12 w-full justify-start px-4"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {logoUrl ? "Change Logo" : t('controls.logo')}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        {logoUrl && (
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={removeLogo}
                                className="h-12 w-12 flex-shrink-0 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                     </div>
                </div>
            </Card>

            {/* Right Column: Preview */}
            <div className="space-y-6 lg:sticky lg:top-24">
                <motion.div
                    layout
                    className="aspect-square w-full max-w-md mx-auto bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center p-12 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 opacity-50 pointer-events-none" />

                    <motion.div
                        key={`${text}-${fgColor}-${bgColor}-${logoUrl}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={springTransition}
                        className="bg-white rounded-3xl p-4 shadow-xl"
                    >
                         <QRCodeSVG
                            ref={qrRef}
                            value={text || "https://lumina.studio"}
                            size={256}
                            bgColor={bgColor} // Actually, qrcode.react handles background differently sometimes, usually transparent if not set, or we can wrap it. But SVG has bgColor prop.
                            fgColor={fgColor}
                            level="H" // High error correction for logos
                            includeMargin={true}
                            imageSettings={logoUrl ? {
                                src: logoUrl,
                                x: undefined,
                                y: undefined,
                                height: 48,
                                width: 48,
                                excavate: true,
                            } : undefined}
                         />
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                        onClick={() => downloadQR('png')}
                        className="h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-900/20 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        {t('actions.downloadPNG')}
                    </Button>
                    <Button
                        onClick={() => downloadQR('svg')}
                        variant="outline"
                        className="h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Settings2 className="w-5 h-5 mr-2" />
                        {t('actions.downloadSVG')}
                    </Button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
