import {
    BrowserRouter,
    Routes,
    Route
} from "react-route-dom";
import ROUTES from "../constants/routes";
import HomePage from "../pages/Login/LoginPage";
import ProductListPage from "../pages/Products/ProductListPage";
import ProdutcDetailPage from "/pages/Products/ProductDetailPage";
function AppRoutes()
{
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={ROUTES.HƠME}
                    element={<HomePage/>}
                />
                <Route
                    path={ROUTES.PRODUCTS}
                    element={<LoginPage/>}
                />
                <Route
                    path={ROUTES.PRODUCTS}
                    element={<ProductListPage />}
                />

                <Route
                    path={ROUTES.PRODUCT_DETAIL}
                    element={<ProductDetailPage />}
                />

            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;