import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import {
    LayoutDashboard,
    BarChart3,
    UserCircle,
    Boxes,
    Package,
    Receipt,
    Settings,
    LifeBuoy,
    AlertCircle,
    ClipboardList
} from "lucide-react";
import AdminDashBoard from './AdminDashBoard';
import {AdminSideBar} from './AdminSideBar';


// --- Component Layout Chính AdminLayout ---
const AdminLayout: React.FC = () => {
    // Áp dụng styling cho toàn bộ trang
    const pageStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa', 
    };
    
    return (
        <div style={pageStyle}>
            <Container fluid className="p-0">
                <Row className="g-0">

                    <Col xs={2} className="p-0">
                        <AdminSideBar/>
                    </Col>
                    <Col xs={10} className="p-4 bg-light" style={{ backgroundColor: '#f8f9fa' }}>
                        <AdminDashBoard />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLayout; 

