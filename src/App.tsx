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

// ======== Các trang cho Staff ========
import ListRenter from "./components/StaffInterface/ListRenter";
import UserDetail from "./components/StaffInterface/UserDetail";
import ListBookingStaff from "./components/StaffInterface/ListBookingStaff";
import CreateContract from "./components/StaffInterface/CreateContract";
import BookingDetail from "./components/StaffInterface/BookingDetail";
import PhotoCapturePage from "./components/StaffInterface/PhotoCapturePage";
import NotificationsPage from "./components/StaffInterface/NotificationsPage";
import ChooseCar from "./components/StaffInterface/ChooseCar";
import StaffLayout from "./components/layouts/StaffLayout";
import InvoiceDetailPage from "./components/StaffInterface/InvoiceDetailPage";
import PaymentPage from "./components/StaffInterface/PaymentPage";
import CreateInvoice from "./components/StaffInterface/CreateInvoice";

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
              <Route path="contract-preview" element={<ContractPreviewPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="payment-result" element={<PaymentResultPage />} />

              <Route path="staff/login" element={<StaffLogin />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="staff" element={<RequireAuth />}>
              <Route element={<StaffLayout />}>
                <Route index element={<Staff />} />
                <Route path="renters" element={<ListRenter />} />
                <Route path="renter/:id" element={<UserDetail />} />
                <Route path="bookings" element={<ListBookingStaff />} />
                <Route path="vehicle/:vehicleId" element={<ChooseCar />} />
                <Route path="booking/:bookingId/detail" element={<BookingDetail />} />
                <Route path="booking/:bookingId/create-contract" element={<CreateContract />} />
                <Route path="booking/:bookingId/photo/:type" element={<PhotoCapturePage />} />
                <Route path="booking/:bookingId/create-invoice" element={<CreateInvoice />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="booking/:invoiceId/create-invoice" element={<InvoiceDetailPage />} />
                <Route path="payment" element={<PaymentPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>

        <ToastConfig />
      </VehicleProvider>
    </UserProvider>
  );
};

export default App;
