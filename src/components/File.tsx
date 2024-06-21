import { useContext } from "react"
import MidButton from "./MidButton"
import { SyncContext } from "./AppdataFolder"

export default function File({ name, clicked, updateFunc }:
    { name: string, clicked: boolean, updateFunc(checked: boolean): void }) {
    const { syncFunc }: { syncFunc(name: string, bool: boolean): void } = useContext(SyncContext)

    function click() {
        updateFunc(!clicked)
        syncFunc(name, !clicked)
    }

    return <MidButton onClick={click} clicked={clicked}>
        <span>{name}</span>
        <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={clicked} readOnly />
    </MidButton>
}