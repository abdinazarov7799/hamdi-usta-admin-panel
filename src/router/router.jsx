import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import dayjs from "dayjs";


// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import CategoryPage from "../modules/category/pages/CategoryPage.jsx";
import TranslationPage from "../modules/translation/pages/TranslationPage.jsx";
import OverlayLoader from "../components/OverlayLoader.jsx";
import ProductsPage from "../modules/products/pages/ProductsPage.jsx";
import BannerPage from "../modules/banner/pages/BannerPage.jsx";
// PAGES


const Router = ({ ...rest }) => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route
                  path={"/categories"}
                  index
                  element={<CategoryPage />}
              />
              <Route
                  path={"/products"}
                  index
                  element={<ProductsPage />}
              />
              <Route
                  path={"/banner"}
                  index
                  element={<BannerPage />}
              />
              <Route
                  path={"/translations"}
                  index
                  element={<TranslationPage />}
              />
              <Route
                  path={"auth/*"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route
                  path={"/"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
