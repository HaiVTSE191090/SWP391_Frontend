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

const App = () => {
  return (
    <>
      {/* <AppRouter /> */}
      {/* <Mapbox />  */}
      <Navbar />
      <Routes>
        <Route path="/" element={<StaffLogin />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/renters" element={<ListRenter />} />
        <Route path="/staff/renter/:id" element={<UserDetail />} />
        {/* <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} /> */}
      </Routes>
      <Footer />
    </>
  );
};


export default App;
