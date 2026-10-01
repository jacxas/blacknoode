"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        webPreferences: {
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'), // compiled preload
            nodeIntegration: false,
            sandbox: false
        },
        roundedCorners: true,
        backgroundColor: '#0b0f14',
    });
    // AI Studio environment uses port 3000 for dev server
    const devUrl = 'http://localhost:3000';
    const indexHtml = path_1.default.join(__dirname, '../dist/index.html');
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(devUrl);
    }
    else {
        mainWindow.loadFile(indexHtml);
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// IPC handlers
electron_1.ipcMain.handle('app/version', () => {
    return { version: electron_1.app.getVersion() };
});
electron_1.ipcMain.handle('dialog:openFile', async () => {
    const res = await electron_1.dialog.showOpenDialog({ properties: ['openFile'] });
    return res;
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
//# sourceMappingURL=main.js.map