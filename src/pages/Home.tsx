import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

import AppdataFolder from "../components/AppdataFolder";
import LeftPane from "../components/LeftPane";
import { PATHTYPE } from "../common";

export const Context = createContext(null)

export default function Home() {
    const [showFolder, setShowFolder] = useState<PATHTYPE>(null)
    const { state: { provider } } = useLocation()

    return <div className="bg-blue-950 h-full">
        <div className="grid grid-cols-3 justify-center">
            <Context.Provider value={{ setShowFolder }}>
                <LeftPane showFolder={showFolder} />
                <AppdataFolder provider={provider} showFolder={showFolder} />
            </Context.Provider>
        </div>
    </div>
}

export const homePath = "home"
export type Folder = { name: string, checked: boolean }[]