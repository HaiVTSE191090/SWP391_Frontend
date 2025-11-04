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
import PaymentResultPage from "./pages/PaymentResultPage";
// ======== Các trang cho Admin ========
import AdminLayout from "./components/AdminInterface/Admin";
import ListBooking from "./components/AdminInterface/ListBooking";
import ListContract from "./components/AdminInterface/ListContract";
import ContractDetail from "./components/AdminInterface/ContractDetail";
import AdminDashBoard from "./components/AdminInterface/AdminDashBoard";
import AdminLogin from "./components/AdminInterface/AdminLogin";

// ======== Các trang cho Staff ========
import ListRenter from "./components/StaffInterface/ListRenter";
import UserDetail from "./components/StaffInterface/UserDetail";
import ListBookingStaff from "./components/StaffInterface/ListBookingStaff";
import CreateContract from "./components/StaffInterface/CreateContract";
import BookingDetail from "./components/StaffInterface/BookingDetail";
import PhotoCapturePage from "./components/StaffInterface/PhotoCapturePage";
import NotificationsPage from "./components/StaffInterface/NotificationsPage";
import StaffLogin from "./components/StaffInterface/StaffLogin";
import Staff from "./components/StaffInterface/Staff";
import FinalPayment from "./components/FinalPayment/FinalInvoice";

// Lazy load trang chính
const HomePage = lazy(() => import("./pages/HomePage"));

const App = () => {
  return (

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
              <Route path="contract-preview/:bookingId" element={<ContractPreviewPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="payment-result" element={<PaymentResultPage />} />
              <Route path="final-invoice/booking/:bookingId" element={<FinalPayment />} />

              <Route path="staff/login" element={<StaffLogin />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="staff" element={<RequireAuth />}>
                    <Route index element={<Staff />} />
                    <Route path="renters" element={<ListRenter />} />
                    <Route path="renter/:id" element={<UserDetail />} />
                    <Route path="bookings" element={<ListBookingStaff />} />
                    <Route path="booking/:bookingId/detail" element={<BookingDetail />} />
                    <Route path="booking/:bookingId/create-contract" element={<CreateContract />} />
                    <Route path="booking/:bookingId/photo/:type" element={<PhotoCapturePage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                  </Route>
                  {/* admin */}
                  <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashBoard />} />
                    <Route path="contract" element={<ListContract />} />
                    <Route path="contract/:id" element={<ContractDetail />} />
                  </Route>
                </Routes>
              </Suspense>

              <ToastConfig />
            </VehicleProvider>
          </UserProvider>
          );
};

          export default App;
