// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { APIFunctions, IPCSignals } from "./common"

const funcs: APIFunctions = {
    listAppdataFolders: () => ipcRenderer.invoke(IPCSignals.listAppdataFolders),
    showCloudFiles: () => ipcRenderer.invoke(IPCSignals.showCloudFiles),
    chooseProvider: (provider) => ipcRenderer.send(IPCSignals.chooseProvider, provider)
}
contextBridge.exposeInMainWorld("api", funcs)