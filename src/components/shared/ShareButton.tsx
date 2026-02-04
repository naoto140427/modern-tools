"use client";

import React from "react";
import { Share, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
}

export function ShareButton({ url, title = "Lumina Studio", text = "Check out Lumina Studio!", className }: ShareButtonProps) {
  const t = useTranslations("Share");
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(t('success'));
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error(t('failed'));
      }
    }
  };

  return (
    <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className={`text-neutral-400 hover:text-white transition-colors ${className}`}
    >
      {copied ? <Check className="w-5 h-5" /> : <Share className="w-5 h-5" />}
    </Button>
  );
}
