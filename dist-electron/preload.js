"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => electron_1.ipcRenderer.invoke("select-folder"),
    getPathForFile: (file) => electron_1.webUtils.getPathForFile(file),
    scanResources: (folder) => electron_1.ipcRenderer.invoke("scan-resources", folder),
    minimize: () => electron_1.ipcRenderer.invoke("window:minimize"),
    maximize: () => electron_1.ipcRenderer.invoke("window:maximize"),
    close: () => electron_1.ipcRenderer.invoke("window:close"),
    openExternal: (url) => electron_1.ipcRenderer.invoke("open-external", url),
});
