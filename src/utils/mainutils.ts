import { promises as fs } from "fs";
import glob from "glob"
import path from "path"

import { CloudProvider, CloudProviderString } from "../common";
import { CONFIG_PATH } from "./paths";
import { GDrive } from "../cloud/GDrive";

// adapted from stackoverflow answer
// https://stackoverflow.com/a/45826189
export async function getLastModDate(absolutePath: string): Promise<Date> {
    const stat = await fs.stat(absolutePath)
    if (stat.isFile()) return Promise.resolve(stat.mtime)
    return new Promise((resolve, reject) => {
        glob(path.join(absolutePath, '**/*'), (err, files) => {
            if (err) {
                return reject(err)
            }

            return resolve(
                Promise.all(
                    files.map(file => fs.stat(file))
                ).then(files => files.reduce(
                    (stat1, stat2) => stat1.mtime > stat2.mtime ? stat1 : stat2, { mtime: new Date(1970, 0) }
                )).then(({ mtime }) => mtime)
            )
        })
    })
}

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