import React from "react";
import HomeHero from "../components/home/HomeHero";
import { CarList } from "../components/home/CarList";
import { Guide } from "../components/home/Guide";
import SearchPage from "../pages/SearchPage";

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <SearchPage />
            <CarList />
            <Guide />
        </>
    )
};