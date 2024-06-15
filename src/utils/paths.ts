import { join } from "path"
import { app } from "electron";
import { PATHTYPE } from "../common";

export const APP_NAME = "appdatasync"
export const APPDATA_SYNC_PATH = app.getPath("userData")
export const CREDENTIALS_PATH = join(__dirname, 'credentials');
export const TOKEN_FOLDER = join(APPDATA_SYNC_PATH, 'credentials')
export const CONFIG_PATH = join(APPDATA_SYNC_PATH, "config.json")

const LOCAL = process.env["localappdata"]

export const APPDATA_PATHS: Record<PATHTYPE, string> = {
    ROAMING: app.getPath("appData"),
    LOCAL,
    LOCALLOW: LOCAL + "Low"
}