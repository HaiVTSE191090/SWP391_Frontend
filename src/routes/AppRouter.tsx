// src/routes/AppRouter.tsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";

// Lazy load các trang (tối ưu bundle)
const HomePage = lazy(() => import("../pages/HomePage"));
// const CarsPage = lazy(() => import("../pages/CarsPage"));
// const BookingPage = lazy(() => import("../pages/BookingPage"));
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const router = createBrowserRouter([
    {
        path: "/",                 // Route gốc dùng Layout
        element: (
            <Layout />
        ),
        children: [
            // index = route mặc định khi path = "/"
            { index: true, element: <HomePage /> },


            // // 404 bắt mọi thứ còn lại
            // { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

export default function AppRouter() {
    return (
        <Suspense fallback={<div className="container py-5">Đang tải...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
