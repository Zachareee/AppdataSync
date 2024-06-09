import { promises as fs } from "fs";

import { CloudProviderString, RtMSignals } from "../common";
import { CONFIG_PATH } from "./paths";
import { GDrive } from "../cloud/GDrive";

export class CloudProvider {
    static async init(): Promise<typeof CloudProvider> { return notImplemented() }
    static async listFiles(): Promise<string> { return notImplemented() }
    static async abortAuth(): Promise<void> { return notImplemented() }
    static async logout(): Promise<void> { return notImplemented() }
    static async syncFolder(folderName: string): Promise<void> { return notImplemented(folderName) }
}

export type CloudProviderMethods = Exclude<keyof typeof CloudProvider, "prototype">

export const RegisterCloudMethods: {
    [signal in RtMSignals]?: {
        reply?: CloudProviderMethods
        noReply?: CloudProviderMethods
    }
} = {
    showCloudFiles: { reply: "listFiles" },
    syncFolder: { noReply: "syncFolder" },
}


export const providerStringPairing: {[provider in CloudProviderString]?: typeof CloudProvider} = {
  googleDrive: GDrive
}

export async function readConfig(): Promise<Config> {
    return fs.readFile(CONFIG_PATH, "ascii").then(data => JSON.parse(data))
}

export function writeConfig(key: keyof Config, value: any) {
    fs.readFile(CONFIG_PATH, "ascii").then(data => write(key, value, data)).catch(() => write(key, value))
}

function write(key: keyof Config, value: any, data?: string) {
    fs.writeFile(CONFIG_PATH, JSON.stringify({...JSON.parse(data || "{}"), [key]: value}))
}

interface Config {
    provider: CloudProviderString
}

async function notImplemented(...args: unknown[]): Promise<never> {
    args
    throw new Error("Not implemented")
}