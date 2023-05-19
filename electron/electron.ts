import { ipcMain } from "electron";
import { BrowserWindow, app } from "electron/main";
import { join } from "node:path";

async function main() {
    const win = new BrowserWindow({
        frame: false,
        title: "Stellpult",
        maximizable: true,
        backgroundColor: "#fa00",
        // transparent: true,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        },
    });
    win.loadURL("http://localhost:80/");
    win.webContents.openDevTools();
}
app.whenReady().then(main);

function getWin(ev: Electron.IpcMainInvokeEvent) {
    return BrowserWindow.fromWebContents(ev.sender);
}


ipcMain.handle("get-os", () => {
    return process.platform;
});

ipcMain.handle("get-max-state", ev => {
    const win = getWin(ev);
    return win?.isMaximized();
});

ipcMain.handle("win-min", ev => {
    const win = getWin(ev);
    win?.minimize();
});

ipcMain.handle("win-max", ev => {
    const win = getWin(ev);
    win?.maximize();
});

ipcMain.handle("win-res", ev => {
    const win = getWin(ev);
    win?.restore();
});

ipcMain.handle("win-close", ev => {
    const win = getWin(ev);
    win?.close();
});

ipcMain.handle("toggle-devtools", ev => {
    ev.sender.toggleDevTools();
});
