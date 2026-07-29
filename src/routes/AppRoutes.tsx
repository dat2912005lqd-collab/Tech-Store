
import {BrowserRouter,Routes, Route} from "react-router-dom";
import ROUTES from "../constants/routes";
import HomePage from "../pages/Login/LoginPage";
import ProductListPage from "../pages/Products/ProductListPage"; 
import ProductDetailPage from "../pages/Products/ProductDetailPage"; 
function AppRoutes()
{
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={ROUTES.HOME}
                    element={<HomePage/>}
                />
                <Route
                    path={ROUTES.PRODUCTS}
                    element={<ProductListPage/>}
                />

                <Route
                    path={ROUTES.PRODUCT_DETAILS}
                    element={<ProductDetailPage />}
                />

            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;