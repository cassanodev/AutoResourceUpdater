import { contextBridge, ipcRenderer, webUtils } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
  scanResources: (folder: string) => ipcRenderer.invoke("scan-resources", folder),
  
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
});