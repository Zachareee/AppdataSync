import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home, { homePath } from "./pages/Home";
import CloudSelect from "./pages/CloudSelect";

const App = () =>
    <>
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<CloudSelect />}></Route>
                    <Route path={homePath} element={<Home />} />
                    <Route path="*" element={<Navigate to={"/"} />} />
                </Route>
            </Routes>
        </Router>
    </>

export default App