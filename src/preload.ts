// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRenderer } from "electron"
import { RendToMainCalls, RtMSignals, MainToRendCalls, MtRSignals } from "./common"

const rtm: RendToMainCalls = {
    listAppdataFolders: () => send("listAppdataFolders"),
    requestProvider: provider => send("requestProvider", provider),
    abortAuthentication: () => send("abortAuthentication"),
    logout: provider => send("logout", provider),
    accountsAuthed: () => invoke("accountsAuthed"),
    syncFolder: (context, folderName, upload) => send("syncFolder", context, folderName, upload),
    getSyncedFolders: () => invoke("getSyncedFolders")
}

const mtr: MainToRendCalls = {
    runOnProviderReply(callback) {
        on("runOnProviderReply", (_, ...args) =>
            callback(...args)
        )
    },
    runOnFolderChange(callback) {
        on("runOnFolderChange", (_, ...args) =>
            callback(...args)
        )
    },
}

contextBridge.exposeInMainWorld("RTM", rtm)
contextBridge.exposeInMainWorld("MTR", mtr)

function on<T extends MtRSignals>(signal: T, callback: callbackFunc<T>) {
    return ipcRenderer.on(signal, callback)
}

function invoke<T extends RtMSignals>(signal: T, ...args: sendFunc<T>) {
    return <ReturnType<RendToMainCalls[T]>>ipcRenderer.invoke(signal, ...args)
}

function send<T extends RtMSignals>(signal: T, ...args: sendFunc<T>) {
    return ipcRenderer.send(signal, ...args)
}

type sendFunc<T extends RtMSignals> =
    Parameters<RendToMainCalls[T]>

type callbackFunc<T extends MtRSignals> =
    (event: Parameters<Parameters<IpcRenderer["on"]>[1]>[0], ...args: Parameters<Parameters<MainToRendCalls[T]>[0]>) => ReturnType<MainToRendCalls[T]>