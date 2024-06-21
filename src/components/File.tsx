import { useContext, useState } from "react"
import MidButton from "./MidButton"
import { SyncContext } from "./AppdataFolder"

export default function File({ name, clicked }: {
    name: string, clicked: boolean
}) {
    const [checked, setChecked] = useState(clicked)
    const { syncFunc }: { syncFunc(name: string, bool: boolean): void } = useContext(SyncContext)

    function click() {
        setChecked(bool => {
            bool = !bool
            syncFunc(name, bool)
            return bool
        })
    }

    return <MidButton onClick={click} clicked={checked}>
        <span>{name}</span>
        <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={checked} readOnly />
    </MidButton>
}