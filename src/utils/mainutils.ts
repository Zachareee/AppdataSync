import { promises as fs } from "fs";
import { FSWatcher, watch } from "chokidar"
import glob from "glob"
import path from "path"

import { CloudProvider, CloudProviderString, PATHMAPPINGS, PATHTYPE } from "../common";
import { APPDATA_PATHS, CONFIG_PATH } from "./paths";
import { GDrive } from "../cloud/GDrive";

const watchedFiles: Partial<Record<PATHTYPE, Record<string, FSWatcher>>> = { "LOCAL": {}, "LOCALLOW": {}, "ROAMING": {} }

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

export async function watchFolder(context: PATHTYPE, folderName: string, FS: typeof CloudProvider) {
    watchedFiles[context][folderName] = watch(folderName, {
        cwd: APPDATA_PATHS[context],
        ignoreInitial: true
    }).on("all", () => FS.uploadFolder(context, folderName, true))
}

export function unwatchFolder(context: PATHTYPE, folderName: string) {
    watchedFiles[context][folderName].close()
}

export const providerStringPairing: Record<CloudProviderString, typeof CloudProvider> = {
    googleDrive: GDrive
}

export async function readConfig(): Promise<Config> {
    return fs.readFile(CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))
}

export function writeConfig<T extends keyof Config>(key: T, value: Config[T]) {
    readConfig().then(data => write(key, value, data)).catch(() => write(key, value))
}

export function addFolderToConfig(context: PATHTYPE, folderName: string) {
    readConfig().then(config =>
        write("folders", { ...(config.folders || {}), [context]: [...config.folders[context], folderName] }, { ...config }))
}

export function removeFolderFromConfig(context: PATHTYPE, folderName: string) {
    readConfig().then(config =>
        write("folders", { [context]: config.folders[context].filter(folder => folder !== folderName) }, { ...config }))
}

function write<T extends keyof Config>(key: T, value: Config[T], data = {}) {
    fs.writeFile(CONFIG_PATH, JSON.stringify({ ...data, [key]: value }))
}

interface Config {
    provider: CloudProviderString,
    folders: Partial<PATHMAPPINGS>
}