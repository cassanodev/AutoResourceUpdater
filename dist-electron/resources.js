"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanResources = scanResources;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_perf_hooks_1 = require("node:perf_hooks");
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
function isCategory(name) {
    return name.startsWith("[") && name.endsWith("]");
}
function cleanCategory(name) {
    return isCategory(name) ? name.slice(1, -1) : name;
}
async function getManifestVersion(file) {
    try {
        const content = await node_fs_1.promises.readFile(file, "utf8");
        const match = content.match(VERSION_REGEX);
        return match ? `v${match[1]}` : "v0.0.0";
    }
    catch {
        return "v0.0.0";
    }
}
async function scanResources(root) {
    const start = node_perf_hooks_1.performance.now();
    const tree = {};
    function insert(segments, resource, data) {
        let current = tree;
        for (const segment of segments) {
            current[segment] ?? (current[segment] = {});
            current = current[segment];
        }
        current[resource] = data;
    }
    async function walk(absolutePath, logicalPath, allowChildren) {
        let entries;
        try {
            entries = await node_fs_1.promises.readdir(absolutePath, {
                withFileTypes: true,
            });
        }
        catch {
            return;
        }
        let manifest = null;
        for (const entry of entries) {
            if (!entry.isFile())
                continue;
            if (MANIFEST_FILES.has(entry.name)) {
                manifest = entry.name;
                break;
            }
        }
        if (manifest) {
            const version = await getManifestVersion(node_path_1.default.join(absolutePath, manifest));
            const resourceName = node_path_1.default.basename(absolutePath);
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
            if (!entry.isDirectory())
                continue;
            if (SKIP_DIRS.has(entry.name))
                continue;
            const absolute = node_path_1.default.join(absolutePath, entry.name);
            if (isCategory(entry.name)) {
                await walk(absolute, [...logicalPath, cleanCategory(entry.name)], true);
            }
            else {
                await walk(absolute, logicalPath, false);
            }
        }
    }
    await walk(root, [], true);
    console.log(`✓ Resource scan finished in ${Math.round(node_perf_hooks_1.performance.now() - start)}ms`);
    return tree;
}
