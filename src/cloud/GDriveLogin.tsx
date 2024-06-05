import img from "../img/GoogleDriveIcon.svg"
import CloudIcon from "./CloudIcon"

export default function GDriveLogin() {
    return <>
        <span className="text-lg ml-8 text-nowrap">Login with Google Drive</span>
        <CloudIcon src={img} alt="Google Drive icon" />
    </>
}
