import { useContext } from "react";

import { PATHTYPE } from "../common";
import MidButton from "./MidButton";
import { Context } from "../pages/Home";

export default function FolderSelector() {
    const { setShowFolder }: {
        setShowFolder(context: PATHTYPE): void,
    } = useContext(Context)

    return <>
        {PATHTYPE.map((path, key) => <MidButton onClick={() => setShowFolder(path)} key={key}>
            {path}
        </MidButton>)}
    </>
}