import { MainToRendCalls, RendToMainCalls } from "../common"

// eslint-disable-next-line
export const { listAppdataFolders, showCloudFiles, requestProvider, abortAuthentication, logout, accountsAuthed, syncFolder }: RendToMainCalls = RTM
export const { runOnProviderReply }: MainToRendCalls = MTR