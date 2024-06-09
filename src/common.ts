import GoogleDriveIcon from "./img/GoogleDriveIcon.svg"

export interface RendToMainCalls {
    listAppdataFolders(): Promise<string[]>
    showCloudFiles(): Promise<any>
    requestProvider(provider: CloudProviderString): void
    abortAuthentication(): void
    logout(provider: CloudProviderString): void
    accountsAuthed(): Promise<CloudProviderString[]>
    syncFolder(folderName: string, upload: boolean): void
    getSyncedFolders(): Promise<string[]>
}

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles(): Promise<string> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
    static async uploadFolder(folderName: string, upload: boolean): Promise<void> { return notImplemented(folderName, upload) }
    static async downloadFolders(): Promise<string[]> { return notImplemented() }
}

export interface MainToRendCalls {
    runOnProviderReply(callback: (provider: string) => void): void
}

export type RtMSignals = keyof RendToMainCalls
export type MtRSignals = keyof MainToRendCalls

export type ProviderContents = {
    driveName: string
    icon: string
    tokenFile: string
}

export type CloudProviderString = keyof typeof drives

export const drives: { [drive in | "googleDrive"]: ProviderContents } = {
    googleDrive: {
        driveName: "Google Drive",
        icon: GoogleDriveIcon,
        tokenFile: "googleDriveAuth.json"
    }
}

async function notImplemented(...args: unknown[]): Promise<never> {
    args
    throw new Error("Not implemented")
}