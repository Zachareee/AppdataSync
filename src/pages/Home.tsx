import { useLocation } from "react-router-dom";
import Folders from "../components/Folders";

export default function Home() {
    const location = useLocation()

    const { state: { provider } } = location
    return <>
        {/* <button onClick={showCloudFiles}>List files</button> */}
        <span>Current provider: {provider}</span>
        <Folders />
    </>
}

export const homePath = "home"