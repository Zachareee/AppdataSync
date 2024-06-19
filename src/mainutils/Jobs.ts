import { Readable } from "stream"

import { CloudProvider } from "../cloud/CloudProvider";
import { PATHTYPE } from "../common";

const jobs: Record<PATHTYPE, Record<string, Runner>> = { LOCAL: {}, LOCALLOW: {}, ROAMING: {} }

export default class Jobs {
    static FS: typeof CloudProvider

    static init(FS: typeof CloudProvider) {
        Jobs.FS = FS
    }

    static add(context: PATHTYPE, folderName: string, upload: boolean) {
        (jobs[context][folderName] || (jobs[context][folderName] = new Runner()))
            .push([context, folderName, upload])
    }

    static async abort() {
        return await Promise.all(Object.values(jobs).map(
            obj => Promise.all(Object.values(obj).map(entry => entry.abort()))))
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