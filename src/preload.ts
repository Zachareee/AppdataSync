// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRenderer } from "electron"
import { RendToMainCalls, CloudProviderString, RtMSignals, MainToRendCalls, MtRSignals } from "./common"

const rtm: RendToMainCalls = {
    listAppdataFolders: () => invoke("listAppdataFolders"),
    showCloudFiles: () => invoke("showCloudFiles"),
    requestProvider: provider => send("requestProvider", provider),
    abortAuthentication: () => send("abortAuthentication"),
    logout: provider => send("logout", provider),
    accountsAuthed: () => invoke("accountsAuthed"),
    syncFolder: (folderName, upload) => send("syncFolder", folderName, upload)
}

const mtr: MainToRendCalls = {
    runOnProviderReply(callback) {
        on("runOnProviderReply", (_, provider: CloudProviderString) =>
            callback(provider)
        )
    },
}

contextBridge.exposeInMainWorld("RTM", rtm)
contextBridge.exposeInMainWorld("MTR", mtr)

function on(signal: MtRSignals, callback: Parameters<IpcRenderer["on"]>[1]) {
    return ipcRenderer.on(signal, callback)
}

function invoke(signal: RtMSignals, ...args: unknown[]) {
    return ipcRenderer.invoke(signal, ...args)
}

function send(signal: RtMSignals, ...args: unknown[]) {
    return ipcRenderer.send(signal, ...args)
}