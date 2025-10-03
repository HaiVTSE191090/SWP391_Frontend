import React, { useState } from "react";
import SearchBar, { LocationSelection, TimeSelection } from "../components/home/SearchBar";
import Mapbox from "../components/home/MapBox";

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
      {/* Thanh tìm kiếm */}
      <SearchBar onSearch={handleSearch} />

      {/* Bản đồ */}
      <div className="m-4" style={{ height: "50vh", width: "100%" }}>
        <Mapbox selectedLocation={loc} />
      </div>
    </div>
  );
}