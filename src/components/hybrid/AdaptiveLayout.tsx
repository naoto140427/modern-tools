"use client";

import React from "react";
import { FileShelfProvider } from "@/context/FileShelfContext";
import { FloatingDock } from "./FloatingDock";
import { BottomTabBar } from "./BottomTabBar";
import { CommandPalette } from "./CommandPalette";
import { FileShelf } from "./FileShelf";
import { Toaster } from "sonner";

export function AdaptiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <FileShelfProvider>
        <div className="relative min-h-screen w-full bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
            {children}

            {/* Navigation Overlay */}
            <FloatingDock />
            <BottomTabBar />
            <CommandPalette />
            <FileShelf />

            {/* Notifications */}
            <Toaster position="bottom-right" theme="dark" />
        </div>
    </FileShelfProvider>
  );
}
