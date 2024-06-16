import { useState } from "react";

import Folders from "./Folders";
import { CloudProviderString, PATHTYPE, drives } from "../common";
import { getSyncedFolders, listAppdataFolders } from "../utils/windowutils";
import MidButton from "./MidButton";

export default function AppdataFolder({ provider }: { provider: CloudProviderString }) {
    const [appdataFolders, setAppdataFolders] = useState<Partial<Record<PATHTYPE, Folder>>>({})
    const [showFolder, setShowFolder] = useState<PATHTYPE | void>(null)

    function updateFolder(context: PATHTYPE, folder: Folder) {
        setAppdataFolders(folders => {
            folders[context] = folder
            return { ...folders }
        })
    }

    if (!Object.keys(appdataFolders).length) listAppdataFolders()
        .then(folders => getSyncedFolders()
            .then(results => setAppdataFolders(
                Object.fromEntries(Object.entries(folders).map(
                    ([context, files]) => [context, files.map(
                        name => ({ name, checked: results[context as PATHTYPE]?.includes(name) ?? false })
                    )]))
            )))

    return (
        <div className="grid grid-cols-3 justify-center">
            <div className="text-center flex justify-center items-center h-screen">
                <div className="no-drag">
                    {showFolder && <MidButton onClick={() => setShowFolder()}>Return to appdata folders</MidButton>}
                </div>
            </div>
            <div className="flex flex-col items-center h-screen">
                <span className="text-slate-300">Current provider: {drives[provider as CloudProviderString].driveName}</span>
                {showFolder && <span className="text-slate-300">Now in {showFolder}</span>}
                <div className="no-drag overflow-auto">
                    {showFolder
                        ? <Folders context={showFolder} folder={appdataFolders[showFolder]} updateFunc={folder => updateFolder(showFolder, folder)} />
                        : PATHTYPE.map((path, key) => <MidButton onClick={() => setShowFolder(path)} key={key}>
                            {path}
                        </MidButton>)
                    }
                </div>
            </div>
        </div>
    )
}

export type Folder = { name: string, checked: boolean }[]