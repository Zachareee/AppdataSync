import GoogleDriveIcon from "./img/GoogleDriveIcon.svg"

const PATHTYPE_KEYS = ["LOCAL", "LOCALLOW", "ROAMING"] as const

export { PATHTYPE_KEYS as PATHTYPE }
export type PATHTYPE = typeof PATHTYPE_KEYS[number]
export type PATHMAPPINGS = Record<PATHTYPE, string[]>

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