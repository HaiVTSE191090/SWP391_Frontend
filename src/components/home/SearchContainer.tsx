import React, { useState } from "react";
import { LocationSelection, TimeSelection } from "../search/SearchBar";
import Mapbox from "./MapBox";

export default function SearchPage() {
  const [loc, setLoc] = useState<LocationSelection | null>(null);

  const handleLocationUpdate = (newLocation: LocationSelection) => {
    setLoc(newLocation);
  };

  return (
    <div className="container">
      <div className="m-4" style={{ height: "50vh", width: "100%" }}>
        <Mapbox 
          selectedLocation={loc} 
          onLocationChange={handleLocationUpdate}
        />
      </div>
    </div>
  );
}