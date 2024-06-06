import path from "path"
import { app } from "electron";
import { promises as fs } from "fs";
import { CloudProviderString } from "../common";

export const APPDATA_PATH = app.getPath("appData")
export const APPDATA_SYNC_PATH = path.join(APPDATA_PATH, "appdatasync")
export const TOKEN_FOLDER = path.join(APPDATA_SYNC_PATH, 'credentials');
export const PROVIDER_SETTING = path.join(TOKEN_FOLDER, "provider")
const config_path = path.join(APPDATA_SYNC_PATH, "config.json")

export async function readConfig(): Promise<Config> {
    return fs.readFile(config_path, "ascii").then(data => JSON.parse(data))
}

export function writeConfig(key: keyof Config, value: any) {
    fs.readFile(config_path, "ascii").then(data => write(key, value, data)).catch(() => write(key, value))
}

function write(key: keyof Config, value: any, data?: string) {
    fs.writeFile(config_path, JSON.stringify({...JSON.parse(data || "{}"), [key]: value}))
}

interface Config {
    provider: CloudProviderString
}