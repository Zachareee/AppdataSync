import { CloudProvider } from "../cloud/CloudProvider";
import GDrive from "../cloud/GDrive";
import { CloudProviderString } from "../common";

export const providerStringPairing: Record<CloudProviderString, CloudProvider> = {
    googleDrive: new GDrive()
}

export function promisifyObjectValues<V, R>(object: Record<never, V>, func: (param: V) => R) {
    return Promise.all(Object.values(object).map(func))
}