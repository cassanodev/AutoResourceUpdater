"use client";

import type { CSSProperties } from "react";
import { Minus, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header
      className="flex h-9 w-full shrink-0 select-none items-center justify-between border-b border-border/40 bg-background/95 px-3 text-foreground/80 backdrop-blur-none"
      style={{ WebkitAppRegion: "drag" } as CSSProperties}
    >
      <div className="flex items-center gap-2">
        <span 
        // className="text-xs font-medium tracking-wide text-muted-foreground"
        className="text-xs leading-[1.15] tracking-[-0.02em] text-white/[0.94] font-display"
        >
          Auto Resource Updater
        </span>
      </div>

      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: "no-drag" } as CSSProperties}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-8 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => window.electronAPI?.minimize()}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-8 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => window.electronAPI?.maximize()}
        >
          <Square className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-8 rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => window.electronAPI?.close()}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}