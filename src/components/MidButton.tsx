import { ReactNode } from "react"

export default function MidButton({ children, onClick , clicked = false}:
    { children: ReactNode, onClick: React.MouseEventHandler<HTMLDivElement>, clicked?: boolean }) {
    return <div className="flex justify-between p-4 cursor-pointer rounded-xl my-2 text-lg font-bold select-none"
        style={{ background: clicked ? "rgb(29 78 216)" : "rgb(99 102 241)", color: clicked ? "rgb(203 213 225)" : "rgb(0 0 0)" }}
        onClick={onClick}>
        {children}
    </div >
}
