import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../layouts/header-footer/Navbar";
import Footer from "../layouts/header-footer/Footer";
import BookingForm from "../layouts/homepage/BookingForm";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BookingForm />
      <Footer />
    </>
  );
}
