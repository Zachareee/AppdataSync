import { chooseProvider } from "../utils/windowutils";
import GDriveLogin from "../cloud/GDriveLogin";
import { CloudProviderString } from "../common";

export default function CloudSelect() {
    return (
        <div>
            <h1>Choose your cloud provider</h1>
            {Object.entries(providers).map(([provider, elem]) =>
                <button onClick={() => chooseProvider(provider as CloudProviderString)}>
                    {elem()}
                </button>
            )}
        </div>
    )
}

const providers: {[provider in CloudProviderString]?: () => JSX.Element} = {
    "googleDrive": GDriveLogin,
}