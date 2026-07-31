import { promises as fs, type Dirent } from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";

type ResourceData = {
  version: string;
  latestVersion: string;
  source: "github" | "manual";
  status: "update-available" | "up-to-date";
};

type ResourceTree = Record<string, any>;

const VERSION_REGEX = /^\s*version\s+['"]([^'"]+)['"]/m;

const MANIFEST_FILES = new Set([
  "fxmanifest.lua",
  "__resource.lua",
]);

const SKIP_DIRS = new Set([
  ".git",
  ".github",
  ".vscode",
  ".idea",
  "node_modules",
]);

function isCategory(name: string) {
  return name.startsWith("[") && name.endsWith("]");
}

function cleanCategory(name: string) {
  return isCategory(name) ? name.slice(1, -1) : name;
}

async function getManifestVersion(file: string): Promise<string> {
  try {
    const content = await fs.readFile(file, "utf8");

    const match = content.match(VERSION_REGEX);

    return match ? `v${match[1]}` : "v0.0.0";
  } catch {
    return "v0.0.0";
  }
}

export async function scanResources(root: string): Promise<ResourceTree> {
  const start = performance.now();

  const tree: ResourceTree = {};

  function insert(
    segments: string[],
    resource: string,
    data: ResourceData,
  ) {
    let current = tree;

    for (const segment of segments) {
      current[segment] ??= {};
      current = current[segment];
    }

    current[resource] = data;
  }

  async function walk(
    absolutePath: string,
    logicalPath: string[],
    allowChildren: boolean,
  ): Promise<void> {
    let entries: Dirent[];

    try {
      entries = await fs.readdir(absolutePath, {
        withFileTypes: true,
      });
    } catch {
      return;
    }

    let manifest: string | null = null;

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      if (MANIFEST_FILES.has(entry.name)) {
        manifest = entry.name;
        break;
      }
    }

    if (manifest) {
      const version = await getManifestVersion(
        path.join(absolutePath, manifest),
      );

      const resourceName = path.basename(absolutePath);

      insert(logicalPath, resourceName, {
        version,
        latestVersion: "v0.0.0",
        source: "github",
        status: "update-available",
      });

      return;
    }

    if (!allowChildren) {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      if (SKIP_DIRS.has(entry.name)) continue;

      const absolute = path.join(absolutePath, entry.name);

      if (isCategory(entry.name)) {
        await walk(
          absolute,
          [...logicalPath, cleanCategory(entry.name)],
          true,
        );
      } else {
        await walk(
          absolute,
          logicalPath,
          false,
        );
      }
    }
  }

  await walk(root, [], true);

  console.log(
    `✓ Resource scan finished in ${Math.round(performance.now() - start)}ms`,
  );

  return tree;
}