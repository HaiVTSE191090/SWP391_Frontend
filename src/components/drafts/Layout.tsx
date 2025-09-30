import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layouts/header-footer/Navbar";
import Footer from "../components/layouts/header-footer/Footer";
import BookingForm from "../components/layouts/homepage/BookingForm";

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
