export interface APIFunctions {
    listAppdataFolders(): Promise<any>,
    showCloudFiles(): Promise<any>,
    chooseProvider(provider: CloudProviderString): void
}

export const { listAppdataFolders, showCloudFiles, chooseProvider }: APIFunctions = window.api

export enum IPCSignals {
    listAppdataFolders = "0",
    showCloudFiles = "1",
    chooseProvider = "2"
}

export type CloudProviderString = "googleDrive"

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles() { return notImplemented() }
}

async function notImplemented(): Promise<any> {
    throw new Error("Not implemented")
}