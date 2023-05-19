import { contextBridge, ipcRenderer } from "electron";
import { PreloadAPI } from "./preloadApi";

const api: PreloadAPI = {
    getOS() {
        return ipcRenderer.invoke("get-os");
    },
    getMaxState() {
        return ipcRenderer.invoke("get-max-state");
    },
    winMin() {
        return ipcRenderer.invoke("win-min");
    },
    winMax() {
        return ipcRenderer.invoke("win-max");
    },
    winRes() {
        return ipcRenderer.invoke("win-res");
    },
    winClose() {
        return ipcRenderer.invoke("win-close");
    },
    devtools() {
        return ipcRenderer.invoke("toggle-devtools");
    },
};

contextBridge.exposeInMainWorld("preload", api);
