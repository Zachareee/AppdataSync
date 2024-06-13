import { promises as fs } from "fs";

import { CloudProvider, CloudProviderString } from "../common";
import { CONFIG_PATH } from "./paths";
import { GDrive } from "../cloud/GDrive";

export const providerStringPairing: { [provider in CloudProviderString]?: typeof CloudProvider } = {
    googleDrive: GDrive
}

export async function readConfig(): Promise<Config> {
    return fs.readFile(CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))
}

export function writeConfig(key: keyof Config, value: unknown) {
    fs.readFile(CONFIG_PATH, "ascii").then(data => write(key, value, data)).catch(() => write(key, value))
}

export function addFolderToConfig(folderName: string) {
    readConfig().then(config => write("folders", [...(config.folders || []), folderName], { ...config }))
}

export function removeFolderFromConfig(folderName: string) {
    readConfig().then(config => write("folders", config.folders?.filter(folder => folder !== folderName), { ...config }))
}

function write(key: keyof Config, value: unknown, data?: string | object) {
    fs.writeFile(CONFIG_PATH, JSON.stringify({ ...(typeof data === "object" ? data : JSON.parse(data || "{}")), [key]: value }))
}

interface Config {
    provider: CloudProviderString,
    folders: string[]
}