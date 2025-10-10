// src/routes/AppRouter.tsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import SignUpForm from "../components/auth/SignUpForm";
import ManualIdentityPage from "../pages/ManualIdentityPage";
import KycVerificationPage from "../pages/KycVerificationPage";

// Lazy load các trang (tối ưu bundle)
const HomePage = lazy(() => import("../pages/HomePage"));
// const CarsPage = lazy(() => import("../pages/CarsPage"));
// const BookingPage = lazy(() => import("../pages/BookingPage"));
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (<Layout />),
        children: [
            // index = route mặc định khi path = "/"
            { index: true, element: <HomePage /> },

            { path: "/sign-up", element: <SignUpForm /> },

            { path: "/manualIdentity", element: <ManualIdentityPage /> },

            { path: "/kyc-verification", element: <KycVerificationPage /> }


            // // 404 bắt mọi thứ còn lại
            // { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

export default function AppRouter() {
    return (
        //cái này hiển thị thông tin khi không có dữ liệu.
        <Suspense fallback={<div className="container py-5">Đang tải...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
