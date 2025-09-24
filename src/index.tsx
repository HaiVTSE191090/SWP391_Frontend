import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import ManualIdentityPage from "./pages/ManualIdentityPage";
import BookingForm from './layouts/homepage/BookingForm';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <Routes>
        
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/identity/manual" element={<ManualIdentityPage />} />
        </Route>
      </Routes>
    </BrowserRouter> */}
    
    <Layout/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

