import { MainToRendCalls, RendToMainCalls } from "../common"

// eslint-disable-next-line
export const { listAppdataFolders, requestProvider, abortAuthentication, logout, accountsAuthed, syncFolder, getSyncedFolders }: RendToMainCalls = RTM
export const { runOnProviderReply, runOnFolderChange }: MainToRendCalls = MTR