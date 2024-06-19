import { PATHTYPE } from "../common"

export type FILENAMEPROGRESSPAIR = Promise<Record<PATHTYPE, Record<string, Promise<unknown>>>>

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
    static async uploadFolder(context: PATHTYPE, folderName: string, upload: boolean):
        Promise<void> { return notImplemented(context, folderName, upload) }
    static async downloadFolders(): FILENAMEPROGRESSPAIR { return notImplemented() }
}

async function notImplemented(...args: unknown[]): Promise<never> {
    args
    throw new Error("Not implemented")
}