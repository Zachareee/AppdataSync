import { ProviderContents } from "../common";

export default function CloudEntry({ driveName, icon }: ProviderContents) {
    return <>
        <span className="text-lg ml-8 text-nowrap">Login with {driveName}</span>
        <img src={icon} alt={`${driveName} icon`} className="aspect-square max-w-[25%] mr-8" />
    </>
}