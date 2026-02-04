"use client";

import { motion } from "framer-motion";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function GlassTabs({ tabs, activeTab, onChange, className = "" }: GlassTabsProps) {
  return (
    <div className={`flex items-center space-x-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 z-10
              ${isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/10 border border-white/10 shadow-sm rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
