import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { abortAuthentication, accountsAuthed, requestProvider, runOnProviderReply } from "../components/windowutils";
import { CloudProviderString, drives } from "../common";
import { homePath } from "./Home";
import CloudEntry from "../components/CloudEntry";

export default function CloudSelect() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [authed, setAuthed] = useState<CloudProviderString[]>([])

    runOnProviderReply((provider: CloudProviderString) => gotoHome(provider))

    useEffect(() => {
        accountsAuthed().then(setAuthed)
    }, [])

    function gotoHome(provider: CloudProviderString) {
        navigate(homePath, { replace: true, state: { provider } })
    }

    function choose(provider: CloudProviderString) {
        setLoading(true)
        requestProvider(provider)
    }

    function abort() {
        setLoading(false)
        abortAuthentication()
    }

    return loading ? (
        <div className="select-none">
            <h1>Waiting to authenticate</h1>
            <button onClick={abort} className="no-drag">Go back to selection page</button>
        </div>
    ) : (
        <div className="flex flex-col items-center select-none">
            <h1>Choose your cloud provider</h1>
            <div className="flex flex-col items-center justify-center min-w-[50%] no-drag">
                {
                    Object.entries(drives).map(([provider, props], key) =>
                        <div className="w-full" onClick={() => choose(provider as CloudProviderString)} key={key}>
                            {CloudEntry(props, authed.includes(provider as CloudProviderString))}
                        </div>
                    )
                }
            </div>
        </div >
    )
}