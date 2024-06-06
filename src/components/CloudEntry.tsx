import { ProviderContents } from "../common";

export default function CloudEntry({ driveName, icon }: ProviderContents, authed: boolean) {
    return <>
        <span className="text-lg ml-8 text-nowrap">Login with {driveName}</span>
        {authed && <a>Sign out</a>}
        <img src={icon} alt={`${driveName} icon`} className="aspect-square max-w-[25%] mr-8" />
    </>
}