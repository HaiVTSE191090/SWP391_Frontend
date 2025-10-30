import React from "react";
import AppRouter from "./routes/AppRouter";
import Mapbox from "./components/mapbox";
import Staff from "./components/StaffInterface/Staff";
import StaffLogin from "./components/StaffInterface/StaffLogin";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminInterface/AdminLogin";
import Admin from "./AdminInterface/Admin";
import ListRenter from "./components/StaffInterface/ListRenter";
import UserDetail from "./components/StaffInterface/UserDetail";
import ListBooking from "./AdminInterface/ListBooking";
import BookingDetails from "./AdminInterface/BookingDetails";
import ListContract from "./AdminInterface/ListContract";
import ContractDetail from "./AdminInterface/ContractDetail";
import ListBookingStaff from "./components/StaffInterface/ListBookingStaff";
// THÊM: Import component CreateContract
import CreateContract from "./components/StaffInterface/CreateContract"; // Giả định đường dẫn

const App = () => {
  return (
    <>
      {/* <AppRouter /> */}
      {/* <Mapbox />  */}
      <Navbar />
      <Routes>
        <Route path="/" element={<StaffLogin />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/renters" element={<ListRenter />} />
        <Route path="/staff/renter/:id" element={<UserDetail />} />
        <Route path="/staff/bookings" element={<ListBookingStaff />} />
        <Route path="/staff/booking/:bookingId/create-contract" element={<CreateContract />} />

        {/* <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/booking" element={<ListBooking />} />
        <Route path="/admin/booking/:id" element={<BookingDetails />} />
        <Route path="/admin/contract" element={<ListContract />} />
        <Route path="/admin/contract/:id" element={<ContractDetail />} /> */}
      </Routes>
      <Footer />
    </>
  );
};


export default App;