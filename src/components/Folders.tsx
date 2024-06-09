import { useState } from "react"
import { listAppdataFolders, syncFolder } from "../utils/windowutils"

export default function Folders() {
    const [folders, setFolders] = useState<Folder[]>([])

    if (!folders.length) listAppdataFolders().then(folders => setFolders(folders.map(name => ({ name, checked: false } as Folder))))

    function click(idx: number) {
        setFolders(folders => {
            folders[idx].checked = !folders[idx].checked
            syncFolder(folders[idx].name, folders[idx].checked)
            return [...folders]
        })
    }

    return <div className="no-drag">
        {folders.map(({ name, checked }, key) =>
            <div key={key} className={"flex justify-between p-4 cursor-pointer rounded-xl my-2"}
                style={{ background: checked ? "rgb(29 78 216)" : "rgb(99 102 241)", color: checked ? "rgb(203 213 225)" : "rgb(0 0 0)" }} onClick={() => click(key)}>
                <span className="text-lg font-bold select-none">{name}</span>
                <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={checked} readOnly />
            </div>
        )}
    </div>
}

interface Folder {
    name: string
    checked: boolean
}