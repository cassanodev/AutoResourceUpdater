"use client";

import {
  GitBranch,
  FileArchive,
  FolderSearch,
  PackageCheck,
} from "lucide-react";
import { DiscordIcon, reveal } from "../components/misc";
import { useData } from "../providers/DataProvider";
import { openExternal } from "../utils";

export interface FolderScreenProps {
  onSelect: () => void;
}

export function FolderScreen() {
  const { setFolderPath } = useData();

  const handleChangeFolder = async () => {
    try {
      const selectedPath = await window.electronAPI.selectFolder();

      if (!selectedPath) return;

      setFolderPath(selectedPath);
    } catch (error) {
      console.error("Error while selecting folder:", error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) return;

    const path = window.electronAPI.getPathForFile(file);

    setFolderPath(path);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08080A]">
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
          onClick={() => openExternal(process.env.NEXT_PUBLIC_COMMUNITY_URL!)}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-white/40 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white/70"
        >
          <DiscordIcon className="h-3.5 w-3.5 text-white/50" />
          Join Community
        </button>
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-8">
        <div className="flex w-full max-w-[440px] flex-col items-center text-center">
          <div
            className="mb-8 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]"
            style={reveal("0.1s")}
          >
            <FolderSearch className="h-4 w-4 text-white/60" />
          </div>

          <span
            className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/30"
            style={reveal("0.18s")}
          >
            Step 2 of 3
          </span>

          <h1
            className="mb-3 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white/[0.94] font-display"
            style={reveal("0.26s")}
          >
            Locate your resources folder
          </h1>

          <p
            className="mb-10 max-w-[320px] text-[14px] font-normal leading-[1.6] text-white/40"
            style={reveal("0.34s")}
          >
            Point us to the{" "}
            <code className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-white/70">
              resources
            </code>{" "}
            folder inside your FXServer installation.
          </p>

          <div
            className="flex w-full flex-col items-center gap-6"
            style={reveal("0.42s")}
          >
            <div
              onClick={handleChangeFolder}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="group flex w-full max-w-[320px] cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] p-8 transition-colors hover:border-white/[0.22] hover:bg-white/[0.03]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-white/[0.14]">
                <FolderSearch className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/70" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-white/70">
                  Drag your resources folder here
                </p>
                <p className="mt-1 text-[11px] text-white/30">
                  or click to browse
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-white/30">
              <span className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" /> GitHub sync
              </span>
              <span className="flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5" /> Config merge
              </span>
              <span className="flex items-center gap-1.5">
                <FileArchive className="h-3.5 w-3.5" /> Zip &amp; Rar support
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-8 z-10" style={reveal("0.85s")}>
        <span className="font-mono text-[10px] tracking-[0.16em] text-white/25">
          Made By Fragment
        </span>
      </div>
      <div className="absolute bottom-7 right-8 z-10" style={reveal("0.85s")}>
        <span className="font-mono text-[10px] tracking-[0.14em] text-white/18">
          v1.0.0
        </span>
      </div>
    </div>
  );
}