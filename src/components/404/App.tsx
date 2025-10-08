import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import image1 from "./b107a432-100b-4bdc-91ca-e8afcf78061c.png";
import image2 from "./c79a26a8-113c-463f-bc32-23c4aa1958bb.png";

const App: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
        <a className="navbar-brand" href="#">
          <img src={image1} alt="Logo" width="150" />
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Support
              </a>
            </li>
          </ul>
          <a href="#" className="btn btn-outline-primary rounded-pill">
            Start free trial
          </a>
        </div>
      </nav>

      {/* Main Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>404</h1>
          <h2>PAGE NOT FOUND</h2>
          <p>Your search has ventured beyond the known universe.</p>
          <a href="#" className="btn-custom">
            Back To Home
          </a>
        </div>
        <div className="hero-img">
          <img src={image2} alt="Astronaut" className="astronaut" />
        </div>
      </section>
    </div>
  );
};

export default App;