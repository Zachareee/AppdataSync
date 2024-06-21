import { promises as fs } from "fs"

import { CloudProviderString, DIRECTORYTREE, PATHTYPE } from "../common"
import { APPPATHS } from "./Paths"
import { Abortable } from "./Abortable"

export default class Config implements Abortable {
    static inMemoryConfig: ConfigInterface

    static async readConfig(): Promise<ConfigInterface> {
        if (Config.inMemoryConfig) return Config.inMemoryConfig
        return Config.inMemoryConfig = {
            provider: (await fs.readFile(APPPATHS.CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))).provider, folders: {}
        }
    }

    static writeConfig<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T]) {
        Config.inMemoryConfig = { ...Config.inMemoryConfig, [key]: value }
    }

    static addFolderToConfig(context: PATHTYPE, folderName: string) {
        Config.inMemoryConfig.folders?.[context].push(folderName) || (Config.inMemoryConfig.folders[context] = [folderName])
    }

    static removeFolderFromConfig(context: PATHTYPE, folderName: string) {
        Config.inMemoryConfig.folders[context] = Config.inMemoryConfig.folders[context].filter(name => name !== folderName)
    }

    static async abort() {
        return fs.writeFile(APPPATHS.CONFIG_PATH, JSON.stringify({ provider: Config.inMemoryConfig.provider }))
    }
}

interface ConfigInterface {
    provider: CloudProviderString,
    folders: Partial<DIRECTORYTREE>
}