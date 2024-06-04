import Folders from "../components/Folders";
import { listDriveFiles } from "../APIFunctions"

export default function Home() {
    return <>
        <button onClick={listDriveFiles}>List files</button>
        <Folders />
    </>
}