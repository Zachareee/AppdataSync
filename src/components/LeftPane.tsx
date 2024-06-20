import { useContext } from "react";

import { PATHTYPE } from "../common";
import MidButton from "./MidButton";
import { Context } from "../pages/Home";

export default function LeftPane({ showFolder }: { showFolder: PATHTYPE }) {
    const { setShowFolder }: {
        setShowFolder(context: PATHTYPE | void): void,
    } = useContext(Context)

    return (
        <div className="text-center flex justify-center items-center h-screen">
            <div className="no-drag">
                {showFolder && <MidButton onClick={() => setShowFolder()}>Return to appdata folders</MidButton>}
            </div>
        </div>
    )
}