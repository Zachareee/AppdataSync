import { promises as fs } from "fs";

import { CloudProvider, CloudProviderString } from "../common";
import { CONFIG_PATH } from "./paths";
import { GDrive } from "../cloud/GDrive";

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
