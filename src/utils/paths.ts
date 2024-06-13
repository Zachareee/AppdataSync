import { join } from "path"
import { app } from "electron";

export const APPDATA_PATH = app.getPath("appData")//.replace(/\\[^\\]*$/, "")
export const APP_NAME = "appdatasync"
export const APPDATA_SYNC_PATH = app.getPath("userData")
export const TOKEN_FOLDER = join(APPDATA_SYNC_PATH, 'credentials')
export const CONFIG_PATH = join(APPDATA_SYNC_PATH, "config.json")
