import File from "./File"
import { Folder } from "../pages/Home"

export default function Folders({ contents }: {
    contents: Folder
}) {

    return (
        contents.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} />)
    )
}