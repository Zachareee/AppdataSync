export interface APIFunctions {
    listAppdataFolders(): Promise<any>,
    showCloudFiles(): Promise<any>,
    chooseProvider(provider: CloudProviderString): void
}

export enum IPCSignals {
    listAppdataFolders = "0",
    showCloudFiles = "1",
    chooseProvider = "2"
}

export type CloudProviderString = "googleDrive" | "dropbox"

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles() { return notImplemented() }
}

export const RegisterCloudMethods: {
    [signal: string]: (provider: typeof CloudProvider) => (...args: any) => Promise<any>
} = {
    [IPCSignals.showCloudFiles]: (provider) => provider.listFiles
}

async function notImplemented(): Promise<any> {
    throw new Error("Not implemented")
}