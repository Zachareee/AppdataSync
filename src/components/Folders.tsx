import File from "./File"
import { Folder } from "../pages/Home"

export default function Folders({ syncFunc, contents }: {
    contents: Folder, syncFunc(name: string, bool: boolean): void,
}) {

    return (
        contents.map(({ name, checked }, key) =>
            <File key={key} name={name} clicked={checked} syncFunc={syncFunc} />)
    )
}