import { CloudProvider } from "../cloud/CloudProvider";
import GDrive from "../cloud/GDrive";
import { CloudProviderString } from "../common";

export const providerStringPairing: Record<CloudProviderString, typeof CloudProvider> = {
    googleDrive: GDrive
}