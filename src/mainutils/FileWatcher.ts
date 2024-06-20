import { FSWatcher, watch } from "chokidar"

import { PATHTYPE } from "../common";
import { APPDATA_PATHS } from "./Paths";
import { CloudProvider } from "../cloud/CloudProvider";
import { promisifyObjectValues } from "./Utils";
import { Abortable } from "./Abortable";

const watchedFiles = <Record<PATHTYPE, Record<string, FSWatcher>>>Object.fromEntries(PATHTYPE.map(context => [context, {}]))
const appdataRoots = <Record<PATHTYPE, FSWatcher>>Object.fromEntries(PATHTYPE.map(context => [context, null]))

export default class FileWatcher extends Abortable {
    static watchAppdataRoots(func: (context: PATHTYPE) => void) {
        Object.entries(APPDATA_PATHS).forEach(([context, path]) =>
            appdataRoots[<PATHTYPE>context] = watch(path, {
                ignoreInitial: true,
                depth: 0
            }).on("all", () => func(<PATHTYPE>context))
        )
    }

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


    static override async abort() {
        await promisifyObjectValues(appdataRoots, watcher => watcher.close())
        return FileWatcher.unwatchAll()
    }
}