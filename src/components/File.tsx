import { useState } from "react"
import { syncFolder } from "../utils/windowutils"
import { PATHTYPE } from "../common"
import MidButton from "./MidButton"

export default function File({ name, clicked, context, updateFunc }:
    { name: string, clicked: boolean, context: PATHTYPE, updateFunc(checked: boolean): void }) {
    const [checked, setChecked] = useState(clicked)

    function click() {
        setChecked(bool => {
            bool = !bool
            updateFunc(bool)
            syncFolder(context, name, bool)
            return bool
        })
    }

    return <MidButton onClick={click} clicked={checked}>
        <span>{name}</span>
        <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={checked} readOnly />
    </MidButton>
}