import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
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
import AdminBookingDetail from "./components/AdminInterface/BookingDetail";
import ListContract from "./components/AdminInterface/ListContract";
import AdminDashBoard from "./components/AdminInterface/AdminDashBoard";
import AdminLogin from "./components/AdminInterface/AdminLogin";
import AdminContractPage from "./components/AdminInterface/AdminContractPage";

// ======== Các trang cho Staff ========
import ListRenter from "./components/StaffInterface/ListRenter";
import UserDetail from "./components/StaffInterface/UserDetail";
import ListBookingStaff from "./components/StaffInterface/ListBookingStaff";
import CreateContract from "./components/StaffInterface/CreateContract";
import StaffBookingDetail from "./components/StaffInterface/BookingDetail";
import PhotoCapturePage from "./components/StaffInterface/PhotoCapturePage";
import NotificationsPage from "./components/StaffInterface/NotificationsPage";
import StaffLogin from "./components/StaffInterface/StaffLogin";
import Staff from "./components/StaffInterface/Staff";
import FinalPayment from "./components/FinalPayment/FinalInvoice";
import AdminRequireAuth from "./components/AdminInterface/services/AdminRequireAuth";
import ChooseCar from "./components/StaffInterface/ChooseCar";
import StaffLayout from "./components/layouts/StaffLayout";
import InvoiceDetailPage from "./components/StaffInterface/InvoiceDetailPage";
import PaymentPage from "./components/StaffInterface/PaymentPage";
import CreateInvoice from "./components/StaffInterface/CreateInvoice";
import AdminConfig from "./components/AdminInterface/AdminConfig";
import AdminConfigDetail from "./components/AdminInterface/AdminConfigDetail";
import AdminVehicleModel from "./components/AdminInterface/AdminVehicleModel";
import AdminVehicleModelDetail from "./components/AdminInterface/AdminVehicleModelDetail";
import AdminStation from "./components/AdminInterface/AdminStation";
import AdminStationDetail from "./components/AdminInterface/AdminStationDetail";
import AdminVehicle from "./components/AdminInterface/AdminVehicle";
import AdminVehicleDetail from "./components/AdminInterface/AdminVehicleDetail";
import AdminBlacklist from "./components/AdminInterface/AdminBlackList";
import AdminReportDetail from "./components/AdminInterface/AdminReportDetail";
import AdminProfile from "./components/AdminInterface/AdminProfile";

const HomePage = lazy(() => import("./pages/HomePage"));
//hàm này để trong config thì được chứ tự nhiên để đây nó bị sai logic vl
function removeExpiredToken() {
  const currentTime = new Date().getTime() / 1000;
  const token = localStorage.getItem("token");
  if (!token) {
    return
  };
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (currentTime > payload.exp) {
    alert("Hết phiên đăng nhập")
    localStorage.removeItem("token");
    window.location.reload();
  }
}

window.addEventListener("load", removeExpiredToken);
window.addEventListener("beforeunload", removeExpiredToken);

const App = () => {
  return (

    <UserProvider>
      <VehicleProvider>
        <Suspense fallback={<div className="container py-5">Đang tải...</div>}>
          <Routes>
            {/* renter */}
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
              <Route path="admin/login" element={<AdminLogin />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route >
            <Route path="staff" element={<RequireAuth />}>
              <Route element={<StaffLayout />}>
                <Route index element={<Staff />} />
                <Route path="renters" element={<ListRenter />} />
                <Route path="renter/:id" element={<UserDetail />} />
                <Route path="bookings" element={<ListBookingStaff />} />
                <Route path="booking/:bookingId/detail" element={<StaffBookingDetail />} />
                <Route path="vehicle/:vehicleId" element={<ChooseCar />} />
                <Route path="booking/:bookingId/create-contract" element={<CreateContract />} />
                <Route path="booking/:bookingId/photo/:type" element={<PhotoCapturePage />} />
                <Route path="booking/:bookingId/create-invoice" element={<CreateInvoice />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="invoice/:invoiceId" element={<InvoiceDetailPage />} />
                <Route path="payment" element={<PaymentPage />} />
              </Route>
            </Route>
            {/* admin */}
            <Route path="admin" element={<AdminRequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashBoard />} />
                <Route path="contract" element={<ListContract />} />
                <Route path="contract/:bookingId" element={<AdminContractPage />} />
                <Route path="booking" element={<ListBooking />} />
                <Route path="booking/:bookingId" element={<AdminBookingDetail />} />
                <Route path="config" element={<AdminConfig />} />
                <Route path="config/details/:policyId" element={<AdminConfigDetail />} />
                <Route path="config/details" element={<AdminConfigDetail/>}/>
                <Route path="vehicle-model" element={<AdminVehicleModel/>} />
                <Route path="vehicle-model/detail/:modelId" element={<AdminVehicleModelDetail/>}/>
                <Route path="vehicle-model/detail/" element={<AdminVehicleModelDetail/>}/>
                <Route path="station" element={<AdminStation/>}/>
                <Route path="station/detail/:stationId" element={<AdminStationDetail />} />
                <Route path="station/detail" element={<AdminStationDetail />} />
                <Route path="customers" element={<AdminBlacklist/>}/>
                <Route path="reports/:bookingId" element={<AdminReportDetail/>}/>
                <Route path="vehicles" element={<AdminVehicle/>}/>
                <Route path="vehicles/details/:vehicleId" element={<AdminVehicleDetail/>}/>
                <Route path="vehicles/details/" element={<AdminVehicleDetail/>}/>
                <Route path="profile" element={<AdminProfile/>}/>
              </Route>
            </Route>
          </Routes >
        </Suspense >

        <ToastConfig />
      </VehicleProvider >
    </UserProvider >
  );
};

export default App;
