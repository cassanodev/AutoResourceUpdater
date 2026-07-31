"use client";

import {
  Folder,
  Package,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  Search,
  ChevronRight,
  LogOut,
  Download,
  GitBranch,
  AlertCircle,
  Layers,
  FolderOpen,
} from "lucide-react";
import type { ResourceLeaf, ResourceTree } from "../typings";
import { useEffect, useMemo, useState } from "react";
import { useData } from "../providers/DataProvider";
import { signOut } from "next-auth/react";

function isLeaf(node: ResourceTree | ResourceLeaf): node is ResourceLeaf {
  return typeof node === "object" && node !== null && "version" in node;
}

function sortEntries(node: ResourceTree) {
  return Object.entries(node).sort(([keyA, a], [keyB, b]) => {
    const aFolder = !isLeaf(a);
    const bFolder = !isLeaf(b);
    if (aFolder !== bFolder) return aFolder ? -1 : 1;
    return keyA.localeCompare(keyB);
  });
}

function countStats(node: ResourceTree): { total: number; pending: number } {
  let total = 0;
  let pending = 0;
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (isLeaf(child)) {
      total += 1;
      if (child.status === "update-available") pending += 1;
    } else {
      const sub = countStats(child);
      total += sub.total;
      pending += sub.pending;
    }
  }
  return { total, pending };
}

function getNodeAtPath(tree: ResourceTree, path: string[]): ResourceTree {
  let node = tree;
  for (const seg of path) {
    const child = node[seg];
    if (!child || isLeaf(child)) return {};
    node = child;
  }
  return node;
}

interface FlatMatch {
  path: string[];
  name: string;
  res: ResourceLeaf;
}

function flattenLeaves(node: ResourceTree, path: string[]): FlatMatch[] {
  const out: FlatMatch[] = [];
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (isLeaf(child)) {
      out.push({ path, name: key, res: child });
    } else {
      out.push(...flattenLeaves(child, [...path, key]));
    }
  }
  return out;
}

function ResourceRow({
  name,
  res,
  pathLabel,
}: {
  name: string;
  res: ResourceLeaf;
  pathLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.015] px-4 py-3 transition-colors hover:border-white/[0.1] hover:bg-white/[0.03] group">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.03]">
        <Package className="h-3.5 w-3.5 text-white/40" />
      </div>
      <div className="min-w-0 flex-1">
        {pathLabel && (
          <p className="truncate font-mono text-[10px] text-white/25">{pathLabel}</p>
        )}
        <p className="truncate text-[12.5px] font-medium text-white/85">{name}</p>
      </div>
      <span className="flex w-20 shrink-0 items-center gap-1.5 text-[10.5px] text-white/30">
        {res.source === "github" ? (
          <GitBranch className="h-3 w-3" />
        ) : (
          <Layers className="h-3 w-3" />
        )}
        {res.source === "github" ? "GitHub" : "Manual"}
      </span>
      <span className="w-28 shrink-0 text-right font-mono text-[11px] text-white/40">
        {res.version}
        {res.status === "update-available" && (
          <span className="ml-1 text-amber-400/90">→ {res.latestVersion}</span>
        )}
      </span>
      <span className="w-28 shrink-0 text-right">
        {res.status === "update-available" ? (
          <button className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400 opacity-0 transition-colors hover:bg-amber-500/20 group-hover:opacity-100">
            <Download className="h-3 w-3" />
            Update
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Up to date
          </span>
        )}
      </span>
    </div>
  );
}

function FolderCard({
  name,
  node,
  onOpen,
}: {
  name: string;
  node: ResourceTree;
  onOpen: () => void;
}) {
  const stats = useMemo(() => countStats(node), [node]);
  return (
    <button
      onClick={onOpen}
      className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 text-center transition-colors hover:border-white/[0.16] hover:bg-white/[0.035]"
    >
      {stats.pending > 0 && (
        <span className="absolute right-3 top-3 rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">
          {stats.pending}
        </span>
      )}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-white/[0.16]">
        <Folder className="h-5 w-5 text-white/45" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-white/85">{name}</p>
        <p className="mt-0.5 font-mono text-[10px] text-white/30">
          {stats.total} {stats.total === 1 ? "item" : "items"}
        </p>
      </div>
    </button>
  );
}

export function Dashboard() {
  const { user, folderPath, setFolderPath, resources } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const handleChangeFolder = async () => {
    try {
      const selectedPath = await window.electronAPI.selectFolder();
      if (!selectedPath) return;
      setFolderPath(selectedPath);
    } catch (error) {
      console.error("Error while selecting folder:", error);
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const overall = useMemo(() => countStats(resources), [resources]);

  const matches = useMemo(() => {
    if (!isSearching) return [];
    return flattenLeaves(resources, []).filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.path.some((seg) => seg.toLowerCase().includes(query)),
    );
  }, [resources, query, isSearching]);

  const currentNode = useMemo(
    () => getNodeAtPath(resources, currentPath),
    [resources, currentPath],
  );
  const entries = useMemo(() => sortEntries(currentNode), [currentNode]);
  const folderEntries = entries.filter(([, child]) => !isLeaf(child)) as [
    string,
    ResourceTree,
  ][];
  const fileEntries = entries.filter(([, child]) => isLeaf(child)) as [
    string,
    ResourceLeaf,
  ][];

  const topCategories = useMemo(
    () => Object.keys(resources).sort((a, b) => a.localeCompare(b)),
    [resources],
  );

  const navigateTo = (path: string[]) => {
    setSearchQuery("");
    setCurrentPath(path);
  };

  if (!user) return null;

  return (
    <div className="relative h-full w-full flex overflow-hidden bg-[#08080A]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_20%)]" />

      <aside className="relative z-10 w-64 shrink-0 border-r border-white/[0.06] bg-[#0A0A0D] flex flex-col">
        <div className="p-4 space-y-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08080A] border border-white/[0.08] rounded-md pl-8 pr-3 py-2 text-[11px] text-white/85 placeholder-white/25 focus:outline-none focus:border-white/[0.22] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-white/25" />
              <span className="text-white/40 flex-1">Total resources</span>
              <span className="text-white/80 font-mono">{overall.total}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white/40 flex-1">Updates available</span>
              <span className="text-amber-400 font-mono">{overall.pending}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white/40 flex-1">Up to date</span>
              <span className="text-emerald-400 font-mono">
                {overall.total - overall.pending}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[10px] font-medium text-white/25 uppercase tracking-wider px-1 mb-2">
            Categories
          </div>
          {topCategories.map((category) => {
            const node = resources[category];
            const stats = !isLeaf(node) ? countStats(node) : { total: 0, pending: 0 };
            const active = currentPath[0] === category;
            return (
              <button
                key={category}
                onClick={() => navigateTo([category])}
                className={
                  active
                    ? "w-full flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.06] text-left cursor-pointer"
                    : "w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-left cursor-pointer"
                }
              >
                <Folder className="w-3.5 h-3.5 shrink-0 text-white/30" />
                <span
                  className={
                    active
                      ? "text-[11px] text-white/90 flex-1 truncate font-medium"
                      : "text-[11px] text-white/60 flex-1 truncate"
                  }
                >
                  {category}
                </span>
                <span className="text-[10px] text-white/25 font-mono">
                  {stats.total}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/[0.06] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 text-[11px] font-medium font-display shrink-0">
            {user.name?.slice(1, 3) || ""}
          </div>
          <div className="flex-1 leading-tight min-w-0">
            <div className="text-[11px] font-medium text-white/85 truncate">
              {user.name}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-emerald-400">Connected</span>
            </div>
          </div>
          <button
            title="Sign out"
            className="text-white/30 hover:text-white/80 transition-colors cursor-pointer"
            onClick={() => {
              localStorage.removeItem("folderPath");
              signOut();
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        <div className="shrink-0 flex items-center gap-3 px-6 py-3.5 border-b border-white/[0.06] bg-[#08080A]">
          <HardDrive className="w-4 h-4 text-white/25 shrink-0" />
          <span className="text-[11px] font-mono text-white/45 truncate flex-1">
            {folderPath}
          </span>
          <button
            onClick={handleChangeFolder}
            className="inline-flex items-center gap-1.5 border border-white/[0.08] hover:bg-white/[0.04] text-white/50 text-[11px] px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Change folder
          </button>
          <button
            title="Rescan"
            className="text-white/30 hover:text-white/80 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {!isSearching && (
          <div className="shrink-0 flex items-center gap-1.5 px-6 py-3 border-b border-white/[0.06] text-[12px]">
            <button
              onClick={() => navigateTo([])}
              className={
                currentPath.length === 0
                  ? "text-white/85 font-medium"
                  : "text-white/40 hover:text-white/75 transition-colors"
              }
            >
              resources
            </button>
            {currentPath.map((seg, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-white/20" />
                <button
                  onClick={() => navigateTo(currentPath.slice(0, i + 1))}
                  className={
                    i === currentPath.length - 1
                      ? "text-white/85 font-medium"
                      : "text-white/40 hover:text-white/75 transition-colors"
                  }
                >
                  {seg}
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((m) => (
                  <ResourceRow
                    key={`${m.path.join("/")}/${m.name}`}
                    name={m.name}
                    res={m.res}
                    pathLabel={["resources", ...m.path].join(" / ")}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-white/30">
                No resources match your search.
              </div>
            )
          ) : (
            <div className="space-y-8">
              {folderEntries.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {folderEntries.map(([key, child]) => (
                    <FolderCard
                      key={key}
                      name={key}
                      node={child}
                      onOpen={() => navigateTo([...currentPath, key])}
                    />
                  ))}
                </div>
              )}

              {fileEntries.length > 0 && (
                <div className="space-y-2">
                  {folderEntries.length > 0 && (
                    <div className="px-1 text-[10px] font-medium uppercase tracking-wider text-white/25">
                      Resources
                    </div>
                  )}
                  {fileEntries.map(([key, child]) => (
                    <ResourceRow key={key} name={key} res={child} />
                  ))}
                </div>
              )}

              {folderEntries.length === 0 && fileEntries.length === 0 && (
                <div className="py-16 text-center text-sm text-white/30">
                  This folder is empty.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
