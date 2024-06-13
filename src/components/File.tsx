import { useState } from "react"
import { syncFolder } from "../utils/windowutils"

export default function File({ name, clicked}: { name: string, clicked: boolean }) {
    const [checked, setChecked] = useState(clicked)

    function click() {
        setChecked(bool => {
            bool = !bool
            syncFolder(name, bool)
            return bool
        })
    }

    return <div className={"flex justify-between p-4 cursor-pointer rounded-xl my-2"}
        style={{ background: checked ? "rgb(29 78 216)" : "rgb(99 102 241)", color: checked ? "rgb(203 213 225)" : "rgb(0 0 0)" }} onClick={click}>
        <span className="text-lg font-bold select-none">{name}</span>
        <input type="checkbox" className="rounded-full size-8 cursor-pointer" onFocus={(e) => e.target.blur()} checked={checked} readOnly />
    </div>
}