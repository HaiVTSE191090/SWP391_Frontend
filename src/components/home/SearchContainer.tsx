import React, { useState } from "react";
import SearchBar from "../search/SearchBar";
import Mapbox from "./MapBox";
import { LocationSelection, TimeSelection } from "../../models/SearchModel";

export default function SearchPage() {
  const [loc, setLoc] = useState<LocationSelection | null>(null);
  const [time, setTime] = useState<TimeSelection | null>(null);

  const handleSearch = (location: LocationSelection, timeSel: TimeSelection) => {
    console.log("Search info:", location, timeSel);
    setLoc(location);
    setTime(timeSel);
  };

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} />

      <div className="m-4" style={{ height: "50vh", width: "100%" }}>
        <Mapbox selectedLocation={loc} />
      </div>
    </div>
  );
}