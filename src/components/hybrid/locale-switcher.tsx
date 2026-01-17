"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // 言語を切り替える関数
  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ja" : "en";
    
    // 現在のパス（例: /ja/about）から言語部分を置換する
    // 注意: next-intlの仕様に合わせてパスを構築
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const nextPath = segments.join("/");

    startTransition(() => {
      router.replace(nextPath);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      disabled={isPending}
      className="text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
    >
      <Languages className="mr-2 h-4 w-4" />
      <span className="uppercase text-xs font-bold tracking-widest">
        {locale === "en" ? "English" : "日本語"}
      </span>
    </Button>
  );
}