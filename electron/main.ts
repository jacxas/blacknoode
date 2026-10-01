import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // compiled preload
      nodeIntegration: false,
      sandbox: false
    },
    roundedCorners: true,
    backgroundColor: '#0b0f14',
  });

  // AI Studio environment uses port 3000 for dev server
  const devUrl = 'http://localhost:3000';
  const indexHtml = path.join(__dirname, '../dist/index.html');

  if (process.env.VITE_DEV_SERVER) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// IPC handlers
ipcMain.handle('app/version', () => {
  return { version: app.getVersion() };
});

ipcMain.handle('dialog:openFile', async () => {
  const res = await dialog.showOpenDialog({ properties: ['openFile'] });
  return res;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
