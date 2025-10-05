import React from "react";
import HomeHero from "../components/home/HomeHero";
import { CarList } from "../components/home/CarList";
import { Guide } from "../components/home/Guide";
import SearchContainer from "../components/home/SearchContainer";

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <SearchContainer />
            <CarList />
            <Guide />
        </>
    )
};