import File from "./File"
import { PATHTYPE } from "../common"
import { Folder } from "./AppdataFolder"

export default function Folders({context, folder}: {context: PATHTYPE, folder: Folder}) {
    console.log(folder)
    return <div className="overflow-auto h-dvh">
        {folder.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} context={context}/>
        )}
    </div>
}