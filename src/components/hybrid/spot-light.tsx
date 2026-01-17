"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Image as ImageIcon,
  Server,
  Zap,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function SpotLight() {
  const [open, setOpen] = React.useState(false);

  // Cmd + K で開閉する魔法のコード
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* メイン機能 */}
        <CommandGroup heading="Actions">
          <CommandItem>
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Convert Images (WebP/PNG)</span>
          </CommandItem>
          <CommandItem>
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Optimize for Speed</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />

        {/* 収益化への導線（今はダミーですが、将来ここがクリックされます） */}
        <CommandGroup heading="Recommendations">
          <CommandItem>
            <Server className="mr-2 h-4 w-4 text-blue-400" />
            <span>Upgrade Server (Ad)</span>
            <CommandShortcut>PRO</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* 設定周り */}
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}