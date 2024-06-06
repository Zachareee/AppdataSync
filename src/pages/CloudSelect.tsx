import { useNavigate } from "react-router-dom";

import { abortAuthentication, requestProvider, runOnProviderReply } from "../utils/windowutils";
import GDriveLogin from "../cloud/GDriveLogin";
import { CloudProviderString } from "../common";
import { homePath } from "./Home";
import { useState } from "react";

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

    return loading ? (
        <div>
            <h1>Waiting to authenticate</h1>
            <button onClick={abortAuthentication}>Go back to selection page</button>
        </div>
    ) : (
        <div className="flex flex-col items-center">
            <h1>Choose your cloud provider</h1>
            <div className="flex justify-center min-w-[50%]">
                {
                    Object.entries(providers).map(([provider, elem], key) =>
                        <div className="flex justify-center items-center border-2 border-black rounded-xl cursor-pointer w-max justify-between" onClick={() => choose(provider as CloudProviderString)} key={key}>
                            {elem()}
                        </div>
                    )
                }
            </div>
        </div >
    )
}

const providers: { [provider in CloudProviderString]?: () => JSX.Element } = {
    "googleDrive": GDriveLogin,
}