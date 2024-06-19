import { join } from "path"
import { app } from "electron";
import { PATHTYPE } from "../common";

const LOCAL = process.env["localappdata"]

const APPDATA = app.getPath("userData")

export const APPPATHS: Record<string, string> = {
    APP_NAME: "appdatasync",
    APPDATA_SYNC_PATH: APPDATA,
    CREDENTIALS_PATH: join(__dirname, 'credentials'),
    TOKEN_FOLDER: join(APPDATA, 'credentials'),
    CONFIG_PATH: join(APPDATA, "config.json"),
}

export const APPDATA_PATHS: Record<PATHTYPE, string> = {
    ROAMING: app.getPath("appData"),
    LOCAL,
    LOCALLOW: LOCAL + "Low"
}