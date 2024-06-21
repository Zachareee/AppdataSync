import { createContext, useState } from "react";

import Folders from "./Folders";
import { CloudProviderString, PATHTYPE, drives } from "../common";
import { Folder } from "../pages/Home";
import { getSyncedFolders, listAppdataFolders, runOnFolderChange, syncFolder } from "./windowutils";
import FolderSelector from "./FolderSelector";

export const SyncContext = createContext(null)

export default function AppdataFolder({ provider, showFolder }: {
    provider: CloudProviderString, showFolder: PATHTYPE
}) {
    const [appdataFolders, setAppdataFolders] = useState<AppdataStructure>({})
    if (!Object.keys(appdataFolders).length) listAppdataFolders()

    runOnFolderChange((context, files) => {
        getSyncedFolders().then(results =>
            setAppdataFolders(folders =>
                ({ ...folders, [context]: files.map(name => ({ name, checked: results[context as PATHTYPE]?.includes(name) ?? false })) as Folder }))
        )
    })

    function syncFunc(name: string, bool: boolean) {
        return syncFolder(showFolder, name, bool)
    }

    return (
        <div className="flex flex-col items-center h-screen">
            <span className="text-slate-300">Current provider: {drives[provider as CloudProviderString].driveName}</span>
            {showFolder && <span className="text-slate-300">Now in {showFolder}</span>}
            <div className="no-drag overflow-auto">
                <SyncContext.Provider value={{ syncFunc }}>
                    {showFolder
                        ? <Folders contents={appdataFolders[showFolder]} />
                        : <FolderSelector />}
                </SyncContext.Provider>
            </div>
        </div>
    )
}

type AppdataStructure = Partial<Record<PATHTYPE, Folder>>