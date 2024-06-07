import { app, BrowserWindow, ipcMain, IpcMainEvent, WebContents } from 'electron';
import path from 'path';
import { promises as fs } from "fs"
import { CloudProviderString, drives, IPCSignals, RegisterCloudMethods } from './common';
import { providerStringPairing, readConfig, writeConfig } from './utils/mainutils';
import { TOKEN_FOLDER } from './utils/paths';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

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
    },
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.addListener("did-finish-load", () => {
    readConfig().then(({ provider }) => registerProvider(mainWindow.webContents, provider))
      .catch(() => { console.warn("No provider file") })
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Create AppdataSync folder
fs.mkdir(TOKEN_FOLDER, { recursive: true })

// Read Appdata folders
handle("listAppdataFolders", async () => await fs.readdir(app.getPath("appData")))

// Registers cloud methods
on("requestProvider", async (event, provider: CloudProviderString) => {
  writeConfig("provider", provider)
  return registerProvider(event.sender, provider)
})

handle("accountsAuthed", async () => {
  const providers: CloudProviderString[] = []
  Object.entries(drives).forEach(
    async ([provider, { tokenFile }]) => {
      try {
        await fs.access(`${TOKEN_FOLDER}/${tokenFile}`)
        providers.push(<CloudProviderString>provider)
      } catch { return }
    })

  return providers
})

on("abortAuthentication", async () => {
  readConfig().then(({ provider }) => providerStringPairing[provider].abortAuth())
  writeConfig("provider", null)
})

on("logout", async (_, provider: CloudProviderString) => providerStringPairing[provider].logout())

async function registerProvider(webContents: WebContents, provider: CloudProviderString) {
  return providerStringPairing[provider]?.init().then(FS => {
    for (const signal in RegisterCloudMethods) {
      ipcMain.removeHandler(signal)
      ipcMain.handle(signal, RegisterCloudMethods[<IPCSignals>signal](FS))
    }
  }).then(() => webContents.send("replyProvider", provider)).catch(console.warn)
}

function handle(signal: IPCSignals, func: (event: IpcMainEvent, ...args: any[]) => any) {
  return ipcMain.handle(signal, func)
}

function on(signal: IPCSignals, func: (event: IpcMainEvent, ...args: any[]) => any) {
  return ipcMain.on(signal, func)
}
