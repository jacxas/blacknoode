"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    version: () => electron_1.ipcRenderer.invoke('app/version'),
    openFile: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    // wrapper para llamadas a backend local/remote
    fetchApi: async (path, opts) => {
        const base = process.env.API_URL || 'http://localhost:4000';
        const res = await fetch(`${base}${path}`, opts);
        return res.json();
    },
    // mini event bus
    on: (channel, cb) => {
        const listener = (_, ...args) => cb(...args);
        electron_1.ipcRenderer.on(channel, listener);
        return () => electron_1.ipcRenderer.removeListener(channel, listener);
    }
});
//# sourceMappingURL=preload.js.map