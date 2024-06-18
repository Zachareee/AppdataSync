import { PATHTYPE } from "../common";
import MidButton from "./MidButton";

export default function LeftPane({showFolder, setShowFolder}: {showFolder: PATHTYPE, setShowFolder: (path?: PATHTYPE) => void}) {
    return (
        <div className="text-center flex justify-center items-center h-screen">
            <div className="no-drag">
                {showFolder && <MidButton onClick={() => setShowFolder()}>Return to appdata folders</MidButton>}
            </div>
        </div>
    )
}