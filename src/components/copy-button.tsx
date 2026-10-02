"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, markdownToPlainText } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  /** When true, strip markdown so paste works in Fiverr plain-text chat. */
  plainText?: boolean;
}

export function CopyButton({
  text,
  className,
  label = "Copy",
  plainText = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const payload = plainText ? markdownToPlainText(text) : text;
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-[11px] font-medium tracking-wide transition",
        copied
          ? "border-accent/20 bg-accent-soft text-accent-deep"
          : "text-muted opacity-0 group-hover:opacity-100 hover:border-line hover:bg-paper hover:text-ink",
        className,
      )}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
