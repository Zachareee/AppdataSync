import File from "./File"
import { PATHTYPE } from "../common"
import { Folder } from "./AppdataFolder"

export default function Folders({context, folder, updateFunc}: {context: PATHTYPE, folder: Folder, updateFunc(folder: Folder): void}) {
    function updateFolder(key: number, checked: boolean) {
        folder[key].checked = checked
        updateFunc(folder)
    }

    return <div>
        {folder.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} context={context} updateFunc={checked => updateFolder(key, checked)}/>
        )}
    </div>
}