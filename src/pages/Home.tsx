import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

import AppdataFolder from "../components/AppdataFolder";
import LeftPane from "../components/LeftPane";
import { getSyncedFolders, listAppdataFolders } from "../utils/windowutils";
import { PATHTYPE } from "../common";

export const Context = createContext(null)

export default function Home() {
    const [appdataFolders, setAppdataFolders] = useState<Partial<Record<PATHTYPE, Folder>>>({})
    const [showFolder, setShowFolder] = useState<PATHTYPE>(null)
    const { state: { provider } } = useLocation()

    if (!Object.keys(appdataFolders).length) listAppdataFolders()
        .then(folders => getSyncedFolders()
            .then(results => setAppdataFolders(
                Object.fromEntries(Object.entries(folders).map(
                    ([context, files]) => [context, files.map(
                        name => ({ name, checked: results[context as PATHTYPE]?.includes(name) ?? false })
                    )]))
            )))

    return <div className="bg-blue-950 h-full">
        <div className="grid grid-cols-3 justify-center">
            <Context.Provider value={{ setShowFolder, appdataFolders, setAppdataFolders }}>
                <LeftPane showFolder={showFolder} setShowFolder={setShowFolder} />
                <AppdataFolder provider={provider} showFolder={showFolder} />
            </Context.Provider>
        </div>
    </div>
}

export const homePath = "home"
export type Folder = { name: string, checked: boolean }[]