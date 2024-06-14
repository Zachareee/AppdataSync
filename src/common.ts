import GoogleDriveIcon from "./img/GoogleDriveIcon.svg"

export type PATHTYPE = Record<"ROAMING" | "LOCAL" | "LOCALLOW", string>
export type PATHMAPPINGS = Record<keyof PATHTYPE, string[]>

// cannot be in mainutils due to conflicts with init of GDrive
export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles(): Promise<string> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
    static async uploadFolder(context: keyof PATHTYPE, folderName: string, upload: boolean): Promise<void> { return notImplemented(context, folderName, upload) }
    static async downloadFolders(): Promise<PATHMAPPINGS> { return notImplemented() }
}

export interface RendToMainCalls {
    listAppdataFolders(): Promise<string[]>
    requestProvider(provider: CloudProviderString): void
    abortAuthentication(): void
    logout(provider: CloudProviderString): void
    accountsAuthed(): Promise<CloudProviderString[]>
    syncFolder(context: keyof PATHTYPE, folderName: string, upload: boolean): void
    getSyncedFolders(): Promise<Partial<PATHMAPPINGS>>
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

export const drives: Record<| "googleDrive", ProviderContents> = {
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