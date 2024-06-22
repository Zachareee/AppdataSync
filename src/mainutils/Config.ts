import { promises as fs } from "fs"

import { CloudProviderString, DIRECTORYTREE, PATHTYPE } from "../common"
import { APPPATHS } from "./Paths"
import Abortable from "./Abortable"
import Notifs from "./Notifs"

class Config implements Abortable {
    inMemoryConfig: ConfigInterface

    async readConfig(): Promise<ConfigInterface> {
        if (this.inMemoryConfig) return this.inMemoryConfig
        return this.inMemoryConfig = {
            provider: (await fs.readFile(APPPATHS.CONFIG_PATH, "ascii").then(data => JSON.parse(data)).catch(() => ({}))).provider,
            folders: {},
            disallowedNotifs: []
        }
    }

    writeConfig<T extends keyof ConfigInterface>(key: T, value: ConfigInterface[T]) {
        this.inMemoryConfig = { ...this.inMemoryConfig, [key]: value }
    }

    addFolderToConfig(context: PATHTYPE, folderName: string) {
        this.inMemoryConfig.folders?.[context].push(folderName) || (this.inMemoryConfig.folders[context] = [folderName])
    }

    removeFolderFromConfig(context: PATHTYPE, folderName: string) {
        this.inMemoryConfig.folders[context] = this.inMemoryConfig.folders[context].filter(name => name !== folderName)
    }

    notifAllowed(template: keyof typeof Notifs.notifTemplates) {
        return !this.inMemoryConfig.disallowedNotifs.includes(template)
    }

    async abort() {
        return fs.writeFile(APPPATHS.CONFIG_PATH, JSON.stringify({ provider: this.inMemoryConfig.provider }))
    }
}

export default new Config()

interface ConfigInterface {
    provider: CloudProviderString,
    folders: Partial<DIRECTORYTREE>,
    disallowedNotifs: (keyof typeof Notifs.notifTemplates)[],
}