// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"
import { APIFunctions, CloudProviderString, IPCSignals } from "./common"

const funcs: APIFunctions = {
    listAppdataFolders: () => invoke("listAppdataFolders"),
    showCloudFiles: () => invoke("showCloudFiles"),
    chooseProvider: provider => invoke("chooseProvider", provider),
    abortAuthentication: () => send("abortAuthentication"),
}
contextBridge.exposeInMainWorld("api", funcs)

ipcRenderer.on("provider", (event: IpcRendererEvent, PROVIDER: CloudProviderString) => {
    contextBridge.exposeInMainWorld("provider", { PROVIDER })
})

function invoke(signal: IPCSignals, ...args: any) {
    return ipcRenderer.invoke(signal, ...args)
}

function send(signal: IPCSignals, ...args: any) {
    return ipcRenderer.send(signal, ...args)
}