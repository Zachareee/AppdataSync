import path from "path"
import { app } from "electron";

export const APPDATA_PATH = app.getPath("appData")
export const APPDATA_SYNC_PATH = path.join(APPDATA_PATH, "appdatasync")
export const TOKEN_FOLDER = path.join(APPDATA_SYNC_PATH, 'credentials');
export const PROVIDER_SETTING = path.join(TOKEN_FOLDER, "provider")