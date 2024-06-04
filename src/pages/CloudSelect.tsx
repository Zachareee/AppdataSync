import GDriveLogin from "../cloud/GDriveLogin";

export default function CloudSelect() {
    return (
        <div>
            <h1>Choose your cloud provider</h1>
            <GDriveLogin />
        </div>
    )
}