import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  version: () => ipcRenderer.invoke('app/version'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // wrapper para llamadas a backend local/remote
  fetchApi: async (path: string, opts?: any) => {
    const base = process.env.API_URL || 'http://localhost:4000';
    const res = await fetch(`${base}${path}`, opts);
    return res.json();
  },
  // mini event bus
  on: (channel: string, cb: (...args: any[]) => void) => {
    const listener = (_: any, ...args: any[]) => cb(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  }
});
