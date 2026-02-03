"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import {
  Home,
  Image as ImageIcon,
  Film,
  FileText,
  Sparkles,
  Music,
  QrCode,
  Type,
  Code2,
  Inbox
} from "lucide-react";
import { useFileShelf } from "@/context/FileShelfContext";

export function FloatingDock() {
  const pathname = usePathname();
  const { setIsOpen } = useFileShelf();

  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-end gap-3 px-4 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
         onMouseMove={(e) => mouseX.set(e.pageX)}
         onMouseLeave={() => mouseX.set(Infinity)}
    >
      <DockItem icon={<Home />} label="Home" href="/" mouseX={mouseX} isActive={pathname === "/"} />
      <div className="w-px h-8 bg-white/10 self-center mx-1" />
      <DockItem icon={<ImageIcon />} label="Image" href="/tools/image" mouseX={mouseX} isActive={pathname.includes("/image")} />
      <DockItem icon={<Film />} label="Video" href="/tools/video" mouseX={mouseX} isActive={pathname.includes("/video")} />
      <DockItem icon={<FileText />} label="PDF" href="/tools/pdf" mouseX={mouseX} isActive={pathname.includes("/pdf")} />
      <DockItem icon={<Sparkles />} label="AI" href="/tools/ai" mouseX={mouseX} isActive={pathname.includes("/ai")} />
      <DockItem icon={<Music />} label="Audio" href="/tools/audio" mouseX={mouseX} isActive={pathname.includes("/audio")} />
      <DockItem icon={<QrCode />} label="QR" href="/tools/qr" mouseX={mouseX} isActive={pathname.includes("/qr")} />
      <DockItem icon={<Type />} label="Text" href="/tools/text" mouseX={mouseX} isActive={pathname.includes("/text")} />
      <DockItem icon={<Code2 />} label="Dev" href="/tools/dev" mouseX={mouseX} isActive={pathname.includes("/dev")} />
      <div className="w-px h-8 bg-white/10 self-center mx-1" />
      <DockButton icon={<Inbox />} label="Shelf" onClick={() => setIsOpen(true)} mouseX={mouseX} />
    </div>
  );
}

function DockItem({ icon, label, href, mouseX, isActive }: { icon: React.ReactNode, label: string, href: string, mouseX: any, isActive: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link href={href} className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/80 text-white px-2 py-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
        {label}
      </div>

      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className={`rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-white/20 text-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
      >
        <div className="w-5 h-5 flex items-center justify-center child-svg">
            {/* We might need to scale icon too if desired, but container scaling is usually enough for mac effect */}
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-full h-full" })}
        </div>
      </motion.div>
      {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />}
    </Link>
  );
}

function DockButton({ icon, label, onClick, mouseX }: { icon: React.ReactNode, label: string, onClick: () => void, mouseX: any }) {
    const ref = React.useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
      <button onClick={onClick} className="group relative flex flex-col items-center">
        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/80 text-white px-2 py-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
          {label}
        </div>
        <motion.div
          ref={ref}
          style={{ width, height: width }}
          className="rounded-2xl flex items-center justify-center bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          <div className="w-5 h-5 flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-full h-full" })}
          </div>
        </motion.div>
      </button>
    );
  }
