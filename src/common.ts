import GoogleDrive from "./img/GoogleDriveIcon.svg"

export interface APIFunctions {
    listAppdataFolders(): Promise<string[]>,
    showCloudFiles(): Promise<any>,
    requestProvider(provider: CloudProviderString): void,
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

export type ProviderContents = {
    driveName: string
    icon: string
    tokenFile: string
}

export const drives: { [drive in CloudProviderString]?: ProviderContents } = {
    "googleDrive": {
        driveName: "Google Drive",
        icon: GoogleDrive,
        tokenFile: "googleDriveAuth.json"
    }
}

async function notImplemented(): Promise<any> {
    throw new Error("Not implemented")
}