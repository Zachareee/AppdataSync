import { ProviderContents } from "../common";

export default function CloudEntry({ driveName, icon }: ProviderContents, authed: boolean) {
    return <div className="flex items-center w-full">
        <div className="flex justify-center items-center border-2 border-black rounded-xl cursor-pointer w-full">
            <span className="text-lg ml-8 text-nowrap">Login with {driveName}</span>
            <img src={icon} alt={`${driveName} icon`} className="aspect-square max-w-[25%] m-auto" />
            {authed && <a className="text-center mr-2">Signed in<br />Options</a>}
        </div>
    </div>
}