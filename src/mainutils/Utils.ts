import { CloudProvider } from "../cloud/CloudProvider";
import GDrive from "../cloud/GDrive";
import { CloudProviderString } from "../common";
import { Abortable } from "./Abortable";
import FileWatcher from "./FileWatcher";
import Jobs from "./Jobs";

export const providerStringPairing: Record<CloudProviderString, typeof CloudProvider> = {
    googleDrive: GDrive
}

export function promisifyObjectValues<V, R>(object: Record<never, V>, func: (param: V) => R) {
    return Promise.all(Object.values(object).map(func))
}

export const Abortables: Abortable[] = [Jobs, FileWatcher]

export async function notImplemented(...args: unknown[]): Promise<never> {
    args
    throw new Error("Not implemented")
}