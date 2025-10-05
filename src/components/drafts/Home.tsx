import React from "react";
import HomeHero from "../home/HomeHero";
import { CarList } from "../home/CarList";
import { Guide } from "../home/Guide";
import SearchBar from "../home/search/SearchBar";

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
