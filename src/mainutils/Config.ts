import { promises as fs } from "fs"

import { CloudProviderString, DIRECTORYTREE, PATHTYPE } from "../common"
import { APPPATHS } from "./Paths"

export default class Config {
    static async readConfig(): Promise<ConfigInterface> {
        return fs.readFile(APPPATHS.CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))
    }

    static async writeConfig<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T]) {
        return Config.readConfig().then(data => write(key, value, data)).catch(() => write(key, value))
    }

    static async addFolderToConfig(context: PATHTYPE, folderName: string) {
        return Config.readConfig().then(config =>
            write("folders", { ...(config.folders || {}), [context]: [...config.folders[context], folderName] }, { ...config }))
    }

    static async removeFolderFromConfig(context: PATHTYPE, folderName: string) {
        return Config.readConfig().then(config =>
            write("folders", { [context]: config.folders[context].filter(folder => folder !== folderName) }, { ...config }))
    }
}

function write<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T], data = {}) {
    return fs.writeFile(APPPATHS.CONFIG_PATH, JSON.stringify({ ...data, [key]: value }))
}

interface ConfigInterface {
    provider: CloudProviderString,
    folders: Partial<DIRECTORYTREE>
}