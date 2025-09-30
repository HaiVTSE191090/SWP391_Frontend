import React from "react";
import HomeHero from "../components/layouts/hero-banner/HomeHero";
import { CarList } from "../components/layouts/car-list/carlist";
import { Guide } from "../components/layouts/guide-component/guide";
import SearchBar from "../components/drafts/SearchBar";

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
