"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DiscordIcon, FragmentMark, reveal } from "../components/misc";
import { openExternal } from "../utils";

export function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    signIn("discord");
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08090B] font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025)_0%,transparent_30%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute inset-0 border border-white/[0.04]" />

      <div
        className="absolute top-8 right-8 z-50 flex items-center gap-2"
        style={reveal("0.05s")}
      >
        <button
          type="button"
          onClick={() => openExternal(process.env.COMMUNITY_URL!)}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-white/40 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white/70"
        >
          <DiscordIcon className="h-3.5 w-3.5 text-white/50" />
          Join Community
        </button>
      </div>

      <div
        className="absolute bottom-7 left-8 z-10 flex items-center gap-2"
        style={reveal("0.85s")}
      >
        <FragmentMark className="h-3.5 w-3.5 text-white/25" />
        <span className="font-mono text-[10px] tracking-[0.16em] text-white/25">
          Made By Fragment
        </span>
      </div>

      <div className="absolute bottom-7 right-8 z-10" style={reveal("0.85s")}>
        <span className="font-mono text-[10px] tracking-[0.14em] text-white/18">
          v1.0.0
        </span>
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-8">
        <div className="flex w-full max-w-[400px] flex-col items-center text-center">
          <div
            className="mb-8 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]"
            style={reveal("0.1s")}
          >
            <FragmentMark className="h-4 w-4 text-white/60" />
          </div>

          <span
            className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/30"
            style={reveal("0.18s")}
          >
            Resource Manager
          </span>

          <h1
            className="font-display mb-3 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white/[0.94]"
            style={reveal("0.26s")}
          >
            Keep resources updated
          </h1>

          <p
            className="mb-10 max-w-[300px] text-[14px] font-normal leading-[1.6] text-white/40"
            style={reveal("0.34s")}
          >
            Connect Discord to manage your FiveM server resources.
          </p>

          <div
            className="flex w-full flex-col items-center gap-4"
            style={reveal("0.42s")}
          >
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="h-[46px] w-full max-w-[280px] gap-2.5 rounded-lg border border-white/10 bg-white text-[13px] font-medium text-black hover:bg-white/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting
                </>
              ) : (
                <>
                  <DiscordIcon className="h-4 w-4" />
                  Continue with Discord
                </>
              )}
            </Button>

            <p className="text-[11px] font-normal tracking-[0.01em] text-white/22">
              Your server files stay local
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}