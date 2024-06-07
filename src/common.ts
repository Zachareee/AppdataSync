import GoogleDrive from "./img/GoogleDriveIcon.svg"

export interface RendToMainCalls {
    listAppdataFolders(): Promise<string[]>
    showCloudFiles(): Promise<any>
    requestProvider(provider: CloudProviderString): void
    abortAuthentication(): void
    logout(provider: CloudProviderString): void
    accountsAuthed(): Promise<CloudProviderString[]>
}

export interface MainToRendCalls {
    runOnProviderReply(callback: (provider: string) => void): void
}

export type RtMSignals = keyof RendToMainCalls
export type MtRSignals = keyof MainToRendCalls

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles(): Promise<string> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
}

export const RegisterCloudMethods: {
    [signal in RtMSignals]?: (provider: typeof CloudProvider) => (...args: unknown[]) => Promise<unknown>
} = {
    showCloudFiles: (provider) => provider.listFiles,
    logout: (provider) => provider.logout
}

export type ProviderContents = {
    driveName: string
    icon: string
    tokenFile: string
}

export type CloudProviderString = "googleDrive" | "dropbox"

export const drives: { [drive in CloudProviderString]?: ProviderContents } = {
    googleDrive: {
        driveName: "Google Drive",
        icon: GoogleDrive,
        tokenFile: "googleDriveAuth.json"
    },
}

async function notImplemented(): Promise<never> {
    throw new Error("Not implemented")
}