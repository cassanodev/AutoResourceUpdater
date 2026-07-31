import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from "electron";

import path from "path";
import { scanResources } from "./resources";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "icon.png"),

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenu(null);
  // mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);

  createWindow();

  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle("open-external", async (_, url: string) => {
    await shell.openExternal(url);
  });

  ipcMain.handle("scan-resources", (_, folder: string) => {
    return scanResources(folder);
  });

  ipcMain.handle("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.handle("window:maximize", () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle("window:close", () => {
    mainWindow?.close();
  });
});
