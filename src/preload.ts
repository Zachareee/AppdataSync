// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { APIFunctions } from "./APIFunctions"

const funcs: APIFunctions = {
    listAppdataFolders: () => ipcRenderer.invoke("files"),
    listDriveFiles: () => ipcRenderer.invoke("gdrive")
}
contextBridge.exposeInMainWorld("api", funcs)