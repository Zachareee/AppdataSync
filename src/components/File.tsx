import { useState } from "react"
import MidButton from "./MidButton"

export default function File({ name, clicked, syncFunc, updateFunc }:
    { name: string, clicked: boolean, syncFunc(name: string, bool: boolean): void, updateFunc(checked: boolean): void }) {
    const [checked, setChecked] = useState(clicked)

    function click() {
        setChecked(bool => {
            bool = !bool
            updateFunc(bool)
            syncFunc(name, bool)
            return bool
        })
    }

    return <MidButton onClick={click} clicked={checked}>
        <span>{name}</span>
        <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={checked} readOnly />
    </MidButton>
}