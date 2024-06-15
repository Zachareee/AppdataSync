import { useLocation } from "react-router-dom";
import AppdataFolder from "../components/AppdataFolder";

export default function Home() {
    const location = useLocation()

    const { state: { provider } } = location
    return <div className="bg-blue-950 h-full">
        <AppdataFolder provider={provider} />
    </div>
}

export const homePath = "home"