import { FSWatcher, watch } from "chokidar"

import { PATHTYPE } from "../common";
import { APPDATA_PATHS } from "./Paths";
import { CloudProvider } from "../cloud/CloudProvider";
import { promisifyObjectValues } from "./Utils";

const watchedFiles: Record<PATHTYPE, Record<string, FSWatcher>> = { LOCAL: {}, LOCALLOW: {}, ROAMING: {} }

export default class FileWatcher {
    static watchFolder(context: PATHTYPE, folderName: string, FS: typeof CloudProvider) {
        return watchedFiles[context][folderName] = watch(folderName, {
            cwd: APPDATA_PATHS[context],
            ignoreInitial: true
        }).on("all", () => FS.uploadFolder(context, folderName, true))
    }

    static unwatchFolder(context: PATHTYPE, folderName: string) {
        return watchedFiles[context][folderName].close()
    }

    static unwatchAll() {
        return promisifyObjectValues(watchedFiles,
            contextGroup => promisifyObjectValues(contextGroup, watcher => watcher.close()))
    }
}