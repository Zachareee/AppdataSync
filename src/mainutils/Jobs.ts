import { Readable } from "stream"

import { CloudProvider } from "../cloud/CloudProvider";
import { PATHTYPE } from "../common";
import { promisifyObjectValues } from "./Utils";
import { Abortable } from "./Abortable";

const jobs: Record<PATHTYPE, Record<string, Runner>> = { LOCAL: {}, LOCALLOW: {}, ROAMING: {} }

export default class Jobs extends Abortable {
    static FS: typeof CloudProvider

    static add(context: PATHTYPE, folderName: string, upload: boolean) {
        (jobs[context][folderName] || (jobs[context][folderName] = new Runner()))
            .push([context, folderName, upload])
    }

    static override abort() {
        return promisifyObjectValues(jobs,
            obj => promisifyObjectValues(obj, entry => entry.abort()))
    }
}

class Runner {
    queue: Readable

    constructor() {
        this.queue = new Readable({ objectMode: true })
        this.queue._read = () => null
        this.queue.on("data", async arr => {
            this.queue.pause()
            await Jobs.FS.uploadFolder(...<uploadFolderOpts>arr)
            this.queue.resume()
        })
    }

    push(arr: uploadFolderOpts) {
        this.queue.push(arr)
    }

    abort() {
        const { promise, resolve } = Promise.withResolvers()
        this.queue.on("end", resolve).push(null)
        return promise
    }
}

type uploadFolderOpts = [context: PATHTYPE, folder: string, upload: boolean]