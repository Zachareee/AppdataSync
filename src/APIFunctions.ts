export interface APIFunctions {
    listAppdataFolders(): Promise<any>,
}

export const { listAppdataFolders }: APIFunctions = window.api