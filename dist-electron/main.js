"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const resources_1 = require("./resources");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        titleBarStyle: "hidden",
        autoHideMenuBar: true,
        icon: path_1.default.join(__dirname, "assets", "icon.png"),
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools();
    electron_1.Menu.setApplicationMenu(null);
    mainWindow.loadURL("http://localhost:3000");
}
electron_1.app.whenReady().then(() => {
    electron_1.Menu.setApplicationMenu(null);
    createWindow();
    electron_1.ipcMain.handle("select-folder", async () => {
        const result = await electron_1.dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        if (result.canceled) {
            return null;
        }
        return result.filePaths[0];
    });
    electron_1.ipcMain.handle("open-external", async (_, url) => {
        await electron_1.shell.openExternal(url);
    });
    electron_1.ipcMain.handle("scan-resources", (_, folder) => {
        return (0, resources_1.scanResources)(folder);
    });
    electron_1.ipcMain.handle("window:minimize", () => {
        mainWindow?.minimize();
    });
    electron_1.ipcMain.handle("window:maximize", () => {
        if (!mainWindow)
            return;
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow.maximize();
        }
    });
    electron_1.ipcMain.handle("window:close", () => {
        mainWindow?.close();
    });
});
