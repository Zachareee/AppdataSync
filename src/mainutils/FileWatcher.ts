import { join } from "path"
import { watch, FSWatcher } from "fs";

import { PATHTYPE } from "../common";
import { APPDATA_PATHS } from "./Paths";
import { promisifyObjectValues } from "./Utils";
import Abortable from "./Abortable";
import Jobs from "./Jobs";

const watchedFiles = <Record<PATHTYPE, Record<string, FSWatcher>>>Object.fromEntries(PATHTYPE.map(context => [context, {}]))
const appdataRoots = <Record<PATHTYPE, FSWatcher>>Object.fromEntries(PATHTYPE.map(context => [context, null]))

class FileWatcher implements Abortable {
    watchAppdataRoots(func: (context: PATHTYPE) => void) {
        Object.entries(APPDATA_PATHS).forEach(([context, path]) =>
            appdataRoots[<PATHTYPE>context] = watch(path, () => func(<PATHTYPE>context))
        )
    }

    watchFolder(context: PATHTYPE, folderName: string) {
        const watcher = watch(join(APPDATA_PATHS[context], folderName), {
            recursive: true
        })
        watchedFiles[context][folderName] = watcher
            .on("ready", () => ["change", "rename"].forEach(
                e => watcher.on(e, () => Jobs.add(context, folderName, true))
            ))
    }

    unwatchFolder(context: PATHTYPE, folderName: string) {
        return watchedFiles[context][folderName].close()
    }

    unwatchAll() {
        return promisifyObjectValues(watchedFiles,
            contextGroup => promisifyObjectValues(contextGroup, watcher => watcher.close()))
    }


    async abort() {
        await promisifyObjectValues(appdataRoots, watcher => watcher.close())
        return this.unwatchAll()
    }
}

export default new FileWatcher()