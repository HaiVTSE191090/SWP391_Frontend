import React from "react";
import HomeHero from "../components/home/HomeHero";
import SearchBar from "../components/home/SearchBar";
import { CarList } from "../components/home/CarList";
import { Guide } from "../components/home/Guide";

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <SearchBar />
            <CarList />
            <Guide />
        </>
    )
};