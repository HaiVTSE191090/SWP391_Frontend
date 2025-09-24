import React from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Navbar from "./layouts/header-footer/Navbar";
import HomeHero from "./layouts/hero-banner/HomeHero";
import { Guide } from "./layouts/guide-component/guide";
import Footer from "./layouts/header-footer/Footer";
import { CarList } from "./layouts/car-list/carlist";
import SearchBar from "./components/SearchBar";
const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HomeHero />
      <CarList />
      <Guide />
      <Footer />
    </div>
  );
};


export default App;
