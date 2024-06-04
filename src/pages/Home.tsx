import Folders from "../components/Folders";
import { showCloudFiles } from "../common"

export default function Home() {
    return <>
        <button onClick={showCloudFiles}>List files</button>
        <Folders />
    </>
}