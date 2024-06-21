import { app, BrowserWindow, IpcMain, ipcMain, Menu, Tray, WebContents } from 'electron';
import path from 'path';
import { promises as fs } from "fs"

import { CloudProviderString, drives, RtMSignals, MtRSignals, PATHTYPE, RendToMainCalls, MainToRendCalls } from './common';
import Config from './mainutils/Config';
import FileWatcher from './mainutils/FileWatcher';
import { APPDATA_PATHS, APPPATHS } from './mainutils/Paths';
import { providerStringPairing } from './mainutils/Utils';
import Jobs from './mainutils/Jobs';
import Abortable from './mainutils/Abortable';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const lock = app.requestSingleInstanceLock()
let window: BrowserWindow;

if (!lock) app.quit()
else app.on("second-instance", () => { window?.restore(); window?.focus() })

const ICON = path.join(__dirname, "icon.png")

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 10
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false
    },
    autoHideMenuBar: true,
    show: false
  });

  const tray = new Tray(ICON).on("double-click", () => mainWindow.show())

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: "Open window", click: () => mainWindow.show()
    },
    {
      label: "Quit", click: () => { app.quit(); mainWindow.destroy() }
    }
  ]))

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.once("did-finish-load", () => {
    Config.readConfig().then(({ provider }) => registerProvider(mainWindow.webContents, provider))
    mainWindow.show()
  })

  mainWindow.on("close", e => {
    e.preventDefault()
    mainWindow.hide()
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => (window = createWindow()));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", async e => {
  e.preventDefault()
  await Promise.all((<Abortable[]>[Jobs, FileWatcher, Config]).map(abortable => abortable.abort()))
  app.exit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Create AppdataSync folder
fs.mkdir(APPPATHS.TOKEN_FOLDER, { recursive: true })

// Read Appdata folders
on("listAppdataFolders", async event => {
  Object.entries(APPDATA_PATHS).forEach(async ([folder, folderpath]) =>
    send(event.sender, "runOnFolderChange", <PATHTYPE>folder, await fs.readdir(folderpath))
  )
  FileWatcher.watchAppdataRoots(async context =>
    send(event.sender, "runOnFolderChange", context, await fs.readdir(APPDATA_PATHS[context]))
  )
})

// Registers cloud methods
on("requestProvider", async (event, provider) => {
  Config.writeConfig("provider", provider)
  return registerProvider(event.sender, provider)
})

handle("accountsAuthed", async () => {
  const providers: CloudProviderString[] = []
  await Promise.all(Object.entries(drives).map(
    async ([provider, { tokenFile }]) => {
      try {
        await fs.access(`${APPPATHS.TOKEN_FOLDER}/${tokenFile}`)
        providers.push(<CloudProviderString>provider)
      } catch { return }
    }
  ))

  return providers
})

on("abortAuthentication", async () => {
  Config.readConfig().then(({ provider }) => providerStringPairing[provider].abortAuth())
  Config.writeConfig("provider", null)
})

on("logout", async (_, provider) => providerStringPairing[provider].logout())

async function registerProvider(webContents: WebContents, provider: CloudProviderString) {
  return providerStringPairing[provider]?.init().then(async FS => {
    const downloadedFoldersPromise = FS["downloadFolders"]()
    ipcMain.removeAllListeners("syncFolder").removeHandler("getSyncedFolders")
    await FileWatcher.unwatchAll()

    Jobs.FS = FS
    handle("getSyncedFolders", async () => await Config.readConfig().then(config => config.folders))


    on("syncFolder", async (_, context, folderName, upload) => {
      (upload ? [Config.addFolderToConfig, FileWatcher.watchFolder] : [Config.removeFolderFromConfig, FileWatcher.unwatchFolder])
        .forEach(func => func(context, folderName, FS))
      Jobs.add(context, folderName, upload)
    })

    const downloadedFolders = await downloadedFoldersPromise
    Config.writeConfig("folders", Object.fromEntries(
      Object.entries(downloadedFolders).map(([context, fileObj]) =>
        [context, Object.entries(fileObj).map(([name, promise]) => {
          promise.then(() => FileWatcher.watchFolder(<PATHTYPE>context, name, FS))
          return name
        })]
      )))
  }).then(() => send(webContents, "runOnProviderReply", provider))
    .catch(console.warn)
}

function send<T extends MtRSignals>(webContents: WebContents, signal: T, ...args: callbackFunc<T>) {
  return webContents.send(signal, ...args)
}

function handle<T extends RtMSignals>(signal: T, func: listenFunc<T, "handle">) {
  return ipcMain.handle(signal, func)
}

function on<T extends RtMSignals>(signal: T, func: listenFunc<T, "on">) {
  return ipcMain.on(signal, func)
}

// I spent 15 mins on this I'm proud of it idc
type listenFunc<T extends RtMSignals, K extends keyof IpcMain> =
  (event: Parameters<Parameters<IpcMain[K]>[1]>[0], ...args: Parameters<RendToMainCalls[T]>) => ReturnType<RendToMainCalls[T]>

type callbackFunc<T extends MtRSignals> = Parameters<Parameters<MainToRendCalls[T]>[0]>