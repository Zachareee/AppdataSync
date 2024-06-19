import { promises as fs } from "fs"

import { CloudProviderString, PATHMAPPINGS, PATHTYPE } from "../common"
import { APPPATHS } from "./Paths"

export default class Config {
    static async readConfig(): Promise<ConfigInterface> {
        return fs.readFile(APPPATHS.CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))
    }

    static writeConfig<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T]) {
        this.readConfig().then(data => write(key, value, data)).catch(() => write(key, value))
    }

    static addFolderToConfig(context: PATHTYPE, folderName: string) {
        this.readConfig().then(config =>
            write("folders", { ...(config.folders || {}), [context]: [...config.folders[context], folderName] }, { ...config }))
    }

    static removeFolderFromConfig(context: PATHTYPE, folderName: string) {
        this.readConfig().then(config =>
            write("folders", { [context]: config.folders[context].filter(folder => folder !== folderName) }, { ...config }))
    }
}

function write<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T], data = {}) {
    fs.writeFile(APPPATHS.CONFIG_PATH, JSON.stringify({ ...data, [key]: value }))
}

interface ConfigInterface {
    provider: CloudProviderString,
    folders: Partial<PATHMAPPINGS>
}