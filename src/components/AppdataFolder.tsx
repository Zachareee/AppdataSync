import Folders from "./Folders";
import { CloudProviderString, PATHTYPE, drives } from "../common";

export default function AppdataFolder({ provider, showFolder }: { provider: CloudProviderString, showFolder: PATHTYPE }) {
    return (
        <div className="flex flex-col items-center h-screen">
            <span className="text-slate-300">Current provider: {drives[provider as CloudProviderString].driveName}</span>
            {showFolder && <span className="text-slate-300">Now in {showFolder}</span>}
            <Folders context={showFolder}/>
        </div>
    )
}