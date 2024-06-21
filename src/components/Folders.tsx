import File from "./File"
import { Folder } from "../pages/Home"

export default function Folders({ contents, updateFunc }: {
    contents: Folder,
    updateFunc(folder: Folder): void
}) {

    function updateFolder(key: number, checked: boolean) {
        contents[key].checked = checked
        updateFunc(contents)
    }

    return (
        contents.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} updateFunc={checked => { updateFolder(key, checked) }} />)
    )
}