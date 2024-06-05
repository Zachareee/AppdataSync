import img from "../img/GoogleDriveIcon.svg"

export default function GDriveLogin() {
    return <div className="flex items-center">
        <span>Login with Google Drive</span>
        <img src={img} alt="Google Drive icon" />
    </div>
}
