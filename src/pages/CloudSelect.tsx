import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { abortAuthentication, requestProvider, runOnProviderReply } from "../utils/windowutils";
import { CloudProviderString, drives } from "../common";
import { homePath } from "./Home";
import CloudEntry from "../components/CloudEntry";

export default function CloudSelect() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    runOnProviderReply((provider: CloudProviderString) => gotoHome(provider))

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
            <div className="flex justify-center min-w-[50%] no-drag">
                {
                    Object.entries(drives).map(([provider, props], key) =>
                        <div className="flex justify-center items-center border-2 border-black rounded-xl cursor-pointer w-max justify-between" onClick={() => choose(provider as CloudProviderString)} key={key}>
                            {CloudEntry(props)}
                        </div>
                    )
                }
            </div>
        </div >
    )
}