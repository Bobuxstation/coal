const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    launchGame: (path, args) => ipcRenderer.send('open-game', path, args)
});