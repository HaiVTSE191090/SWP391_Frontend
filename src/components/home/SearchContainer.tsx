import React, { useState } from "react";
import SearchBar, { LocationSelection, TimeSelection } from "../search/SearchBar";
import Mapbox from "./MapBox";

export default function SearchPage() {
  const [loc, setLoc] = useState<LocationSelection | null>(null);
  const [time, setTime] = useState<TimeSelection | null>(null);

  const handleSearch = (location: LocationSelection, timeSel: TimeSelection) => {
    setLoc(location);
    setTime(timeSel);
  };

  const handleLocationUpdate = (newLocation: LocationSelection) => {
    setLoc(newLocation);
  };

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} />

      <div className="m-4" style={{ height: "50vh", width: "100%" }}>
        <Mapbox 
          selectedLocation={loc} 
          onLocationChange={handleLocationUpdate}
        />
      </div>
    </div>
  );
}