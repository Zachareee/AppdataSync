import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CloudSelect from "./pages/CloudSelect";

const App = () =>
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<CloudSelect />}></Route>
                    <Route path="home" element={<Home />} />
                    <Route path="*" element={<Navigate to={"/"} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>

export default App