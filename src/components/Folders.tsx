import File from "./File"
import { PATHTYPE } from "../common"
import MidButton from "./MidButton"
import { useContext } from "react"
import { Context, Folder } from "../pages/Home"

export default function Folders({ context }: { context: PATHTYPE }) {
    const { setShowFolder, appdataFolders, setAppdataFolders }: {
        setShowFolder(context: PATHTYPE): void,
        appdataFolders: Partial<Record<PATHTYPE, Folder>>,
        setAppdataFolders(folders: typeof appdataFolders | ((folders: typeof appdataFolders) => typeof appdataFolders)): void
    } = useContext(Context)

    function updateFolder(key: number, checked: boolean) {
        appdataFolders[context][key].checked = checked
        setAppdataFolders(appdataFolders)
    }

    return (
        <div className="no-drag overflow-auto">
            {context
                ? appdataFolders[context].map(({ name, checked }, key) =>
                    <File key={key} name={name} clicked={checked} context={context} updateFunc={checked => { updateFolder(key, checked) }} />)
                : PATHTYPE.map((path, key) => <MidButton onClick={() => setShowFolder(path)} key={key}>
                    {path}
                </MidButton>)
            }
        </div>
    )
}