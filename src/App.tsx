import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { VehicleProvider } from "./context/VehicleContext";
import ToastConfig from "./components/common/ToastConfig";
import Layout from "./components/layouts/Layout";
import RequireAuth from "./components/auth/RequireAuth";

// Các trang import thường
import SignUpForm from "./components/auth/SignUpForm";
import ManualIdentityPage from "./pages/ManualIdentityPage";
import KycVerificationPage from "./pages/KycVerificationPage";
import DepositPage from "./components/XacNhanTraXe/components/DepositPage";
import RentalHistoryPage from "./components/HistoryPage/RentalHistoryPage";
import ContractPreviewPage from "./components/ContractPage/ContractPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import VehiclesPage from "./pages/VehiclesPage";
import NotFoundPage from "./components/404/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";
import StaffLogin from "./components/StaffInterface/StaffLogin";
import Staff from "./components/StaffInterface/Staff";
import PaymentResultPage from "./pages/PaymentResultPage";
import AdminLayout from "./components/AdminInterface/Admin";
import ListBooking from "./components/AdminInterface/ListBooking";
import BookingDetail from "./components/AdminInterface/BookingDetail";
import ListContract from "./components/AdminInterface/ListContract";
import AdminDashBoard from "./components/AdminInterface/AdminDashBoard";
import AdminLogin from "./components/AdminInterface/AdminLogin";
import AdminContractPage from "./components/AdminInterface/AdminContractPage";

// Lazy load trang chính
const HomePage = lazy(() => import("./pages/HomePage"));
//hàm này để load lại token khi load lại...
function removeExpiredToken() {
  const currentTime = new Date().getTime() / 1000;
  const token = localStorage.getItem("token");
  if (!token) return;
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (currentTime > payload.exp) {
    localStorage.removeItem("token");
  }
}

window.addEventListener("load", removeExpiredToken);
window.addEventListener("beforeunload", removeExpiredToken);

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <VehicleProvider>
          <Suspense fallback={<div className="container py-5">Đang tải...</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="sign-up" element={<SignUpForm />} />
                <Route path="manualIdentity" element={<ManualIdentityPage />} />
                <Route path="kyc-verification" element={<KycVerificationPage />} />
                <Route path="xac-nhan-dat-xe/:bookingId" element={<DepositPage />} />
                <Route path="rental-history" element={<RentalHistoryPage />} />
                <Route path="contract-preview" element={<ContractPreviewPage />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="vehicles/:id" element={<VehicleDetailPage />} />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="payment-result" element={<PaymentResultPage />} />

                {/* staff */}
                <Route path="staff/login" element={<StaffLogin />} />
                <Route path="staff/" element={<RequireAuth />}>
                  <Route index element={<Staff />} />
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              {/* admin */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashBoard />} />
                <Route path="contract" element={<ListContract />} />
                <Route path="contract/:bookingId" element={<AdminContractPage />} />
                <Route path="booking" element={<ListBooking />} />
                <Route path="booking/:bookingId" element={<BookingDetail />} />
              </Route>
            </Routes>
          </Suspense>

          <ToastConfig />
        </VehicleProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
