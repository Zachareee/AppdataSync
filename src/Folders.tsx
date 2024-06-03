import { ReactNode, useState } from "react"

export default function Folders() {
    const [files, setFiles] = useState<string[]>([])

    if (!files.length) window.api.listFiles().then(setFiles)

    return <div>
        {files.map((element, key) => <p key={key}>{element}</p>)}
    </div>
}