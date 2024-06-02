import Gdrive from "./cloud/Gdrive";

export default function App() {
    return (
        <div>
            <h1>Link an account</h1>
            <div id="providers">
                <Gdrive></Gdrive>
            </div>
        </div>
    )
}