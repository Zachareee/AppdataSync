// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { APIFunctions } from "./APIFunctions"

contextBridge.exposeInMainWorld("api", {
    listAppdataFolders: () => ipcRenderer.invoke("files"),
} as APIFunctions)