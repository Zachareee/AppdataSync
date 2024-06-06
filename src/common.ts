export interface APIFunctions {
    listAppdataFolders(): Promise<any>,
    showCloudFiles(): Promise<any>,
    chooseProvider(provider: CloudProviderString): Promise<boolean>,
    abortAuthentication(): void
}

export type IPCSignals = keyof APIFunctions

export type CloudProviderString = "googleDrive" | "dropbox"

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles() { return notImplemented() }
    static async abortAuth() { return notImplemented() }
}

export const RegisterCloudMethods: {
    [signal in IPCSignals]?: (provider: typeof CloudProvider) => (...args: any) => Promise<any>
} = {
    showCloudFiles: (provider) => provider.listFiles,
}

async function notImplemented(): Promise<any> {
    throw new Error("Not implemented")
}