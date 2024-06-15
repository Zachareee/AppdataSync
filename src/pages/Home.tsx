import { useLocation } from "react-router-dom";
import AppdataFolder from "../components/AppdataFolder";
import { CloudProviderString, drives } from "../common";

export default function Home() {
    const location = useLocation()

    const { state: { provider } } = location
    return <div className="bg-blue-950 flex flex-col items-center">
        <span className="text-slate-300">Current provider: {drives[provider as CloudProviderString].driveName}</span>
        <AppdataFolder />
    </div>
}

export const homePath = "home"