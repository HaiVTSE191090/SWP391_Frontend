import React from "react";
import AppRouter from "./routes/AppRouter";
import Mapbox from "./components/mapbox";
import ListRenter from "./components/StaffInterface/ListRenter";
import Staff from "./components/StaffInterface/Staff";
import StaffLogin from "./components/StaffInterface/StaffLogin";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <>
      {/* <AppRouter /> */}
     {/* <Mapbox />  */}
     <Navbar />
      <Routes>
        <Route path="/" element={<StaffLogin />} />
        <Route path="/staff" element={<Staff />} />      
      </Routes>
      <Footer />
    </>
  );
};


export default App;
