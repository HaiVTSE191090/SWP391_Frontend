// src/routes/AppRouter.tsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import SignUpForm from "../components/auth/SignUpForm";
import ManualIdentityPage from "../pages/ManualIdentityPage";
import KycVerificationPage from "../pages/KycVerificationPage";
import DepositPage from "../components/XacNhanTraXe/components/DepositPage";
import RentalHistoryPage from "../components/HistoryPage/RentalHistoryPage";
import ContractPreviewPage from "../components/ContractPage/ContractPage";
import VehicleDetailPage from "../pages/VehicleDetailPage";
import VehiclesPage from "../pages/VehiclesPage";
import NotFoundPage from "../components/404/NotFoundPage";
import UserProfilePage from "../pages/UserProfilePage";
import PaymentResult from "../pages/PaymentResultPage";
import PaymentResultPage from "../pages/PaymentResultPage";


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
            { index: true, element: <HomePage /> },
            { path: "/sign-up", element: <SignUpForm /> },
            { path: "/manualIdentity", element: <ManualIdentityPage /> },
            { path: "/kyc-verification", element: <KycVerificationPage /> },
            { path: "/xac-nhan-dat-xe/:bookingId", element: <DepositPage /> },
            { path: "/rental-history", element: <RentalHistoryPage /> },
            { path: "/contract-preview/:bookingId", element: <ContractPreviewPage /> },
            { path: "/vehicles", element: <VehiclesPage /> },
            { path: "/vehicles/:id", element: <VehicleDetailPage /> },
            { path: "/profile", element: <UserProfilePage /> },
            { path: "/xac-nhan-dat-xe/:bookingId", element: <DepositPage /> },
            { path: "/payment-result", element: <PaymentResultPage/>},
            // 404 bắt mọi thứ còn lại
            { path: "*", element: <NotFoundPage /> },
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
