import { useState } from "react"
import { getSyncedFolders, listAppdataFolders } from "../utils/windowutils"
import File from "./File"

export default function Folders() {
    const [folders, setFolders] = useState<Folder[]>([])

    if (!folders.length) listAppdataFolders()
        .then(folders => getSyncedFolders()
            .then(results => setFolders(folders.map(name => ({ name, checked: results.includes(name) } as Folder))))
        )

    return <div className="no-drag">
        {folders.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} />
        )}
    </div>
}

interface Folder {
    name: string
    checked: boolean
}