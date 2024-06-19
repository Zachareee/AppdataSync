import { GDrive } from "../cloud/GDrive";
import { CloudProvider, CloudProviderString } from "../common";

export const providerStringPairing: Record<CloudProviderString, typeof CloudProvider> = {
    googleDrive: GDrive
}