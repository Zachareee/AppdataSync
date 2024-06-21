import { PATHTYPE } from "../common"

export type FILENAMEPROGRESSPAIR = Promise<Record<PATHTYPE, Record<string, Promise<unknown>>>>

export interface CloudProvider {
    init(): Promise<CloudProvider>
    abortAuth(): Promise<void>
    logout(): Promise<void>
    uploadFolder(context: PATHTYPE, folderName: string, upload: boolean): Promise<void>
    downloadFolders(): FILENAMEPROGRESSPAIR
}