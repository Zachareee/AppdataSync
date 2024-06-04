export interface APIFunctions {
    listAppdataFolders(): Promise<any>,
    listDriveFiles(): Promise<any>
}

export const { listAppdataFolders, listDriveFiles }: APIFunctions = window.api