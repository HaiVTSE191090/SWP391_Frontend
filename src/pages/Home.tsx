import React from "react";
import HomeHero from "../layouts/hero-banner/HomeHero";
import { CarList } from "../layouts/car-list/carlist";
import { Guide } from "../layouts/guide-component/guide";
import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <>
      <HomeHero />
      <SearchBar />
      <CarList />
      <Guide />
    </>
  );
}
