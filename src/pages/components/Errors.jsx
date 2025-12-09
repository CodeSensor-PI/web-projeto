import { Route, Routes } from "react-router-dom";
import NotFound from "./notFound/NotFound";
import Desconectado from "./desconectado/Desconectado";

const Errors = () => {
    return (
        <div>
            <Routes>
                <Route path="" element={NotFound} />
                <Route path="/desconectado" element={Desconectado} />
            </Routes>
        </div>
    )
}

export default Errors;