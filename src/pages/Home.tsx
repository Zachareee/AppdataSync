import { useLocation } from "react-router-dom";
import Folders from "../components/Folders";
import { CloudProviderString, drives } from "../common";

export default function Home() {
    const location = useLocation()

    const { state: { provider } } = location
    return <div className="bg-blue-950 flex flex-col items-center">
        <span className="text-slate-300">Current provider: {drives[provider as CloudProviderString].driveName}</span>
        <Folders />
    </div>
}

export const homePath = "home"