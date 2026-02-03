"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-neutral-900/50 border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Critical System Failure</h2>
            <p className="text-neutral-400 text-sm mb-6">A critical error occurred. Please restart the system.</p>
            <button
                onClick={reset}
                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
                <RefreshCw className="w-4 h-4" />
                Restart System
            </button>
        </div>
      </body>
    </html>
  );
}
