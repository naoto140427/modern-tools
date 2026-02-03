"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Safety");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 bg-black">
      <Card className="max-w-md w-full bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

        <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{t('error.title')}</h2>
                <p className="text-neutral-400 text-sm">{t('error.desc')}</p>
            </div>

            <Button onClick={reset} className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium shadow-lg shadow-red-900/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('error.action')}
            </Button>
        </div>
      </Card>
    </div>
  );
}
