import GoogleDriveIcon from "./img/GoogleDriveIcon.svg"

export interface RendToMainCalls {
    listAppdataFolders(): Promise<string[]>
    showCloudFiles(): Promise<any>
    requestProvider(provider: CloudProviderString): void
    abortAuthentication(): void
    logout(provider: CloudProviderString): void
    accountsAuthed(): Promise<CloudProviderString[]>
    syncFolder(folderName: string): void
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