import { Readable } from "stream"

import { CloudProvider } from "../cloud/CloudProvider";
import { PATHTYPE } from "../common";
import { promisifyObjectValues } from "./Utils";
import Abortable from "./Abortable";

const jobs: Record<PATHTYPE, Record<string, Runner>> = { LOCAL: {}, LOCALLOW: {}, ROAMING: {} }

class Jobs implements Abortable {
    FS: CloudProvider

    add(context: PATHTYPE, folderName: string, upload: boolean) {
        (jobs[context][folderName] || (jobs[context][folderName] = new Runner()))
            .push([context, folderName, upload])
    }

    async abort() {
        return promisifyObjectValues(jobs,
            obj => promisifyObjectValues(obj, entry => entry.abort()))
    }
}

const jobsObj = new Jobs()
export default jobsObj

class Runner {
    queue: Readable

    constructor() {
        this.queue = new Readable({ objectMode: true })
        this.queue._read = () => null
        this.queue.on("data", async (arr: uploadFolderOpts) => {
            this.queue.pause()
            await jobsObj.FS.uploadFolder(...arr)
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