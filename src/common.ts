import GoogleDriveIcon from "./img/GoogleDriveIcon.svg"

const PATHTYPE_KEYS = ["LOCAL", "LOCALLOW", "ROAMING"] as const
export { PATHTYPE_KEYS as PATHTYPE }
export type PATHTYPE = typeof PATHTYPE_KEYS[number]
export type PATHMAPPINGS = Record<PATHTYPE, string[]>

// cannot be in mainutils due to conflicts with init of GDrive
export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
    static async uploadFolder(context: PATHTYPE, folderName: string, upload: boolean):
        Promise<void> { return notImplemented(context, folderName, upload) }
    static async downloadFolders(): Promise<PATHMAPPINGS> { return notImplemented() }
}

export interface RendToMainCalls {
    listAppdataFolders(): Promise<Partial<PATHMAPPINGS>>
    requestProvider(provider: CloudProviderString): void
    abortAuthentication(): void
    logout(provider: CloudProviderString): void
    accountsAuthed(): Promise<CloudProviderString[]>
    syncFolder(context: PATHTYPE, folderName: string, upload: boolean): void
    getSyncedFolders(): Promise<Partial<PATHMAPPINGS>>
}

export interface MainToRendCalls {
    runOnProviderReply(callback: (provider: CloudProviderString) => void): void
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