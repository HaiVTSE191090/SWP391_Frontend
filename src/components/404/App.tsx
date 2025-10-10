import React from "react";
import { 
  Container, 
  Row, 
  Col, 
  Navbar, 
  Nav, 
  Button, 
  Image 
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import image1 from "./assets/b107a432-100b-4bdc-91ca-e8afcf78061c.png";
import image2 from "./assets/c79a26a8-113c-463f-bc32-23c4aa1958bb.png";

const App: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" bg="white" className="shadow-sm px-4">
        <Container fluid>
          <Navbar.Brand href="#">
            <Image src={image1} alt="Logo" width="150" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link href="#">Products</Nav.Link>
              <Nav.Link href="#">Features</Nav.Link>
              <Nav.Link href="#">Pricing</Nav.Link>
              <Nav.Link href="#">Support</Nav.Link>
            </Nav>
            <Button variant="outline-primary" className="rounded-pill">
              Start free trial
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Section */}
      <Container fluid className="hero-section">
        <Row className="hero align-items-center justify-content-between min-vh-100">
          <Col lg={6} className="hero-text">
            <h1 className="display-1 fw-bold text-muted">404</h1>
            <h2 className="h1 text-secondary mb-4">PAGE NOT FOUND</h2>
            <p className="text-muted mb-4">
              Your search has ventured beyond the known universe.
            </p>
            <Button 
              variant="outline-secondary" 
              className="btn-custom rounded-pill px-4 py-2"
              href="#"
            >
              Back To Home
            </Button>
          </Col>
          <Col lg={6} className="hero-img text-center">
            <Image 
              src={image2} 
              alt="Astronaut" 
              className="astronaut img-fluid" 
              style={{ maxWidth: '350px' }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;