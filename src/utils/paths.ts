import path from "path"
import { app } from "electron";

export const APPDATA_PATH = app.getPath("appData")
export const APP_NAME = "appdatasync"
export const APPDATA_SYNC_PATH = path.join(APPDATA_PATH, APP_NAME)
export const TOKEN_FOLDER = path.join(APPDATA_SYNC_PATH, 'credentials');
export const CONFIG_PATH = path.join(APPDATA_SYNC_PATH, "config.json")
