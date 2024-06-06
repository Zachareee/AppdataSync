import { useLocation } from "react-router-dom";
import Folders from "../components/Folders";

export default function Home() {
    const location = useLocation()

    const { state: { provider } } = location
    return <div className="bg-blue-950 flex flex-col items-center">
        {/* <button onClick={showCloudFiles}>List files</button> */}
        <span className="text-slate-300">Current provider: {provider}</span>
        <Folders />
    </div>
}

export const homePath = "home"