import { useState } from "react"
import { listAppdataFolders } from "../utils/windowutils"

export default function Folders() {
    const [files, setFiles] = useState<string[]>([])

    if (!files.length) listAppdataFolders().then(setFiles)

    return <div>
        {files.map((element, key) => <div key={key}>
            {element}
        </div>)}
    </div>
}