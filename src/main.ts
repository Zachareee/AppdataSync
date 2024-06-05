import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from "fs"
import { GDrive } from './cloud/GDrive';
import { CloudProvider, CloudProviderString, IPCSignals, RegisterCloudMethods } from './common';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
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

// Read Appdata folders
ipcMain.handle(IPCSignals.listAppdataFolders, () => fs.readdirSync(app.getPath("appData")))

// Registers cloud methods
ipcMain.on(IPCSignals.chooseProvider, (event, provider: CloudProviderString) => {
  selectProvider(provider)?.init().then(FS => {
    for (const signal in RegisterCloudMethods) {
      ipcMain.removeHandler(signal)
      ipcMain.handle(signal, RegisterCloudMethods[signal](FS))
    }
  })
})

function selectProvider(provider: CloudProviderString): typeof CloudProvider {
  switch (provider) {
    case "googleDrive":
      return GDrive
  }

  return null
}