import { FSWatcher, watch } from "chokidar"

import { CloudProvider, PATHTYPE } from "../common";
import { APPDATA_PATHS } from "./Paths";

const watchedFiles: Partial<Record<PATHTYPE, Record<string, FSWatcher>>> = { "LOCAL": {}, "LOCALLOW": {}, "ROAMING": {} }

export default class FileWatcher {
    static async watchFolder(context: PATHTYPE, folderName: string, FS: typeof CloudProvider) {
        return watchedFiles[context][folderName] = watch(folderName, {
            cwd: APPDATA_PATHS[context],
            ignoreInitial: true
        }).on("all", () => FS.uploadFolder(context, folderName, true))
    }

    static unwatchFolder(context: PATHTYPE, folderName: string) {
        return watchedFiles[context][folderName].close()
    }

    static unwatchAll() {
        return Promise.all(Object.values(watchedFiles).map(
            contextGroup => Promise.all(Object.values(contextGroup).map(watcher => watcher.close()))))
    }
}