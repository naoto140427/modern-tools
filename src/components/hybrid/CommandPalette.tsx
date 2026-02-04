"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Calculator, Calendar, CreditCard, Settings, User, Image as ImageIcon, Film, FileText, Sparkles, Music, QrCode, Type, Code2, Package, Video } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("CommandPalette"); // We need to add this to translations

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">Command Palette</DialogTitle>
      <DialogContent className="p-0 bg-transparent border-none shadow-2xl max-w-2xl overflow-hidden">
        <Command className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-white" />
            <Command.Input
               placeholder="Type a command or search..."
               className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 text-white"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-neutral-500">No results found.</Command.Empty>

            <Command.Group heading="Tools" className="text-xs font-medium text-neutral-400 px-2 py-1.5">
              <CommandItem icon={<ImageIcon />} onSelect={() => runCommand(() => router.push("/tools/image"))}>Image Lab</CommandItem>
              <CommandItem icon={<Film />} onSelect={() => runCommand(() => router.push("/tools/video"))}>Video Lab</CommandItem>
              <CommandItem icon={<FileText />} onSelect={() => runCommand(() => router.push("/tools/pdf"))}>PDF Lab</CommandItem>
              <CommandItem icon={<Sparkles />} onSelect={() => runCommand(() => router.push("/tools/ai"))}>AI Magic</CommandItem>
              <CommandItem icon={<Music />} onSelect={() => runCommand(() => router.push("/tools/audio"))}>Audio Lab</CommandItem>
              <CommandItem icon={<QrCode />} onSelect={() => runCommand(() => router.push("/tools/qr"))}>QR Master</CommandItem>
              <CommandItem icon={<Type />} onSelect={() => runCommand(() => router.push("/tools/text"))}>Text Lab</CommandItem>
              <CommandItem icon={<Code2 />} onSelect={() => runCommand(() => router.push("/tools/dev"))}>Dev Lab</CommandItem>
              <CommandItem icon={<Package />} onSelect={() => runCommand(() => router.push("/tools/archive"))}>Archive Lab</CommandItem>
              <CommandItem icon={<Video />} onSelect={() => runCommand(() => router.push("/tools/recorder"))}>Screen Recorder</CommandItem>
            </Command.Group>

            <Command.Separator className="h-px bg-white/10 my-1" />

            <Command.Group heading="General" className="text-xs font-medium text-neutral-400 px-2 py-1.5">
               <CommandItem icon={<Settings />} onSelect={() => runCommand(() => router.push("/"))}>Dashboard</CommandItem>
               <CommandItem icon={<Calendar />} onSelect={() => runCommand(() => router.push("/changelog"))}>Changelog</CommandItem>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandItem({ children, icon, onSelect }: { children: React.ReactNode, icon: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-neutral-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
        >
            <span className="mr-2 h-4 w-4">{icon}</span>
            {children}
        </Command.Item>
    )
}
