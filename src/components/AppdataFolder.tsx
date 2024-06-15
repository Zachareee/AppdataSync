import { createContext, useState } from "react";

import Folders from "../pages/Folders";
import { PATHTYPE } from "../common";
import { getSyncedFolders, listAppdataFolders } from "../utils/windowutils";
import MidButton from "./MidButton";

export const AppdataContext = createContext(null)

export default function AppdataFolder() {
    const [appdataFolders, setAppdataFolders] = useState<Partial<Record<PATHTYPE, Folder>>>({})
    const [showFolder, setShowFolder] = useState<PATHTYPE | void>(null)

    if (!Object.keys(appdataFolders).length) listAppdataFolders()
        .then(folders => getSyncedFolders()
            .then(results => setAppdataFolders(
                Object.fromEntries(Object.entries(folders).map(
                    ([context, files]) => ([context.toUpperCase(), files.map(
                        name => ({ name, checked: results[context as PATHTYPE]?.includes(name) ?? false })
                    )])))
            )))

    return (
        <div className="no-drag">
            <AppdataContext.Provider value={{ return: () => setShowFolder() }}>
                {showFolder
                    ? <Folders context={showFolder} folder={appdataFolders[showFolder]} />
                    : PATHTYPE.map((path, key) => <MidButton onClick={() => setShowFolder(path)} key={key}>
                        {path}
                    </MidButton>)
                }
            </AppdataContext.Provider>
        </div>
    )
}

export type Folder = { name: string, checked: boolean }[]