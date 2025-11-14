import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { AdminSideBar } from './AdminSideBar';


const AdminLayout: React.FC = () => {
    const pageStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa',
    };

    return (
        <div style={pageStyle}>
            <Container fluid className="p-0">
                <Row className="g-0">

                    <Col xs={2} className="p-0">
                        <AdminSideBar />
                    </Col>
                    <Col xs={10} className="p-4 bg-light" style={{ backgroundColor: '#f8f9fa' }}>
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLayout;

