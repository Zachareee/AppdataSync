import { CloudProvider } from "../cloud/CloudProvider";
import GDrive from "../cloud/GDrive";
import { CloudProviderString } from "../common";

export const providerStringPairing: Record<CloudProviderString, typeof CloudProvider> = {
    googleDrive: GDrive
}

export function promisifyObjectValues<U extends string, V, R>(object: Record<U, V>, func: (param: V) => R) {
    return Promise.all(Object.values<V>(object).map(func))
}