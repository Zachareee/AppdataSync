import { promises as fs } from "fs";
import glob from "glob"
import path from "path"
import { Readable, PassThrough } from "stream"
import { c, x } from "tar";

import { APPDATA_PATHS } from "./Paths";
import { PATHTYPE } from "../common";

export default class Archive {
    // adapted from stackoverflow answer
    // https://stackoverflow.com/a/45826189
    static async getLastModDate(absolutePath: string): Promise<Date> {
        const stat = await fs.stat(absolutePath)
        if (stat.isFile()) return stat.mtime
        return new Promise((resolve, reject) => {
            glob(path.join(absolutePath, '**/*'), (err, files) => {
                if (err) {
                    return reject(err)
                }

                return resolve(
                    Promise.all(files.map(file => fs.stat(file)))
                        .then(files => files.filter(stat => stat.isFile()).map(({ mtime }) => mtime))
                        .then(files => files.reduce(
                            (date1, date2) => date1 > date2 ? date1 : date2, new Date(1970, 0)
                        ))
                        .then(date => {
                            date.setMilliseconds(0)
                            return date
                        })
                )
            })
        })
    }

    static createArchive(cwd: PATHTYPE, folderName: string, sync = false): Readable {
        return c({
            gzip: true,
            sync,
            cwd: APPDATA_PATHS[cwd]
        }, [folderName]).pipe(new PassThrough())
    }

    static async extractArchive(cwd: PATHTYPE, data: Readable, sync = false) {
        return new Promise(res => data.pipe(x({
            cwd: APPDATA_PATHS[cwd],
            sync,
        }).on("end", res)))
    }
}