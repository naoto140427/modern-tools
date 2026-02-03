"use client";

import React from "react";
import { useFileShelf, ShelfItem } from "@/context/FileShelfContext";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";
import { X, File, Image as ImageIcon, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileShelf() {
  const { items, removeItem, clearShelf, isOpen, setIsOpen } = useFileShelf();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 z-50 p-6 shadow-2xl"
                    >
                        <ShelfContent items={items} onRemove={removeItem} onClear={clearShelf} onClose={() => setIsOpen(false)} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-[#111] flex flex-col rounded-t-[10px] h-[85vh] fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none">
          <div className="p-4 bg-[#111] rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-neutral-600 mb-8" />
            <ShelfContent items={items} onRemove={removeItem} onClear={clearShelf} onClose={() => setIsOpen(false)} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function ShelfContent({ items, onRemove, onClear, onClose }: { items: ShelfItem[], onRemove: (id: string) => void, onClear: () => void, onClose: () => void }) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Global File Shelf</h2>
                <div className="flex gap-2">
                    {items.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={onClear} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 space-y-4">
                    <div className="p-4 rounded-full bg-white/5 border border-white/5">
                        <File className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No files in shelf</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="group relative flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/10">
                                {item.previewUrl ? (
                                    <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <File className="w-6 h-6 text-neutral-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{item.file.name}</p>
                                <p className="text-xs text-neutral-500">{item.source} • {(item.file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={item.previewUrl || URL.createObjectURL(item.file)}
                                    download={item.file.name}
                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg"
                                    onClick={(e) => {
                                         // If we created a temporary URL just for this click, we should theoretically revoke it,
                                         // but previewUrl is managed.
                                         if (!item.previewUrl) e.stopPropagation();
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
