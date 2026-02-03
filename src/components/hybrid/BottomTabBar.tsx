"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Grid, Inbox, Settings } from "lucide-react";
import { useFileShelf } from "@/context/FileShelfContext";

export function BottomTabBar() {
  const pathname = usePathname();
  const { setIsOpen } = useFileShelf();

  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 lg:hidden z-50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <TabItem
            icon={<Home />}
            label="Home"
            href="/"
            isActive={pathname === "/"}
            onClick={vibrate}
        />
        <TabItem
            icon={<Grid />}
            label="Tools"
            href="/#tools"
            isActive={pathname.startsWith("/tools")}
            onClick={vibrate}
        />
        <button
            onClick={() => { vibrate(); setIsOpen(true); }}
            className="flex flex-col items-center justify-center space-y-1 w-16"
        >
            <div className={`p-1 rounded-xl transition-colors ${false ? 'text-white' : 'text-neutral-500'}`}>
                <Inbox className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-neutral-500">Shelf</span>
        </button>
        <TabItem
            icon={<Settings />}
            label="Settings"
            href="/changelog"
            isActive={pathname === "/changelog"}
            onClick={vibrate}
        />
      </div>
    </div>
  );
}

function TabItem({ icon, label, href, isActive, onClick }: { icon: React.ReactNode, label: string, href: string, isActive: boolean, onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex flex-col items-center justify-center space-y-1 w-16"
        >
            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                {label}
            </span>
        </Link>
    )
}
