const {app, BrowserWindow, ipcMain} = require('electron');
const remote = require('electron').remote;

function initWindow() {
    const window = new BrowserWindow({
        width: 1024,
        height: 600,
        title: 'AB Coal',
        frame: false,
        preload: './script/preload.js',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    require('@electron/remote/main').initialize();
    try {
        require('electron-reloader')(module);
    } catch (e) {}
    window.loadFile('views/index.html');
    window.setMenuBarVisibility(false);
}
app.on('ready', () => {
    initWindow();
});
ipcMain.on('open-game', (event, path, args) => {
    const child = require('child_process').spawn(path, args);
})
app.on('browser-window-created', (event, window) => {
    require('@electron/remote/main').enable(window.webContents);
})
// exit all windows onclose
app.on('window-all-closed', () => {
    app.quit();
});
// darwin: quit when all windows are closed
app.on('quit', () => {
    app.quit();
});
