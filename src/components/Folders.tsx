import File from "./File"
import { PATHTYPE } from "../common"
import { Folder } from "./AppdataFolder"

export default function Folders({context, folder}: {context: PATHTYPE, folder: Folder}) {
    return <div>
        {folder.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} context={context}/>
        )}
    </div>
}