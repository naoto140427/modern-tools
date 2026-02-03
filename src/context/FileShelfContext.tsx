"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface ShelfItem {
  id: string;
  file: File;
  previewUrl?: string;
  source: string; // e.g., "ImageLab", "Upload"
  timestamp: number;
}

interface FileShelfContextType {
  items: ShelfItem[];
  addItem: (file: File, source?: string) => void;
  removeItem: (id: string) => void;
  clearShelf: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FileShelfContext = createContext<FileShelfContextType | undefined>(undefined);

export function FileShelfProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((file: File, source: string = "Upload") => {
    const newItem: ShelfItem = {
      id: crypto.randomUUID(),
      file,
      source,
      timestamp: Date.now(),
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
    };

    setItems((prev) => [newItem, ...prev]);
    toast.success("Added to File Shelf");
    setIsOpen(true); // Auto-open shelf to show feedback
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find(i => i.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearShelf = useCallback(() => {
    items.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
  }, [items]);

  return (
    <FileShelfContext.Provider value={{ items, addItem, removeItem, clearShelf, isOpen, setIsOpen }}>
      {children}
    </FileShelfContext.Provider>
  );
}

export function useFileShelf() {
  const context = useContext(FileShelfContext);
  if (context === undefined) {
    throw new Error("useFileShelf must be used within a FileShelfProvider");
  }
  return context;
}
