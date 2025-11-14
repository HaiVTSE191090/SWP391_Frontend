// Ví dụ: Tạo file StaffLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarStaff from '../StaffInterface/NavbarStaff';
import FooterStaff from '../StaffInterface/FooterStaff';

const StaffLayout: React.FC = () => {
    return (
        <>
            <NavbarStaff />
            <Outlet /> 
            <FooterStaff />
        </>
    );
};

export default StaffLayout;
