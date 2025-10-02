import React, { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function Mapbox() {
  const [viewState, setViewState] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 13,
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" // style free
      >
        <NavigationControl position="top-left" />
        <Marker longitude={106.660172} latitude={10.762622} color="red" />
        <Marker longitude={106.6653} latitude={10.8380} color="red" />
        <Marker longitude={106.8230} latitude={10.9020} color="red" />
        <Marker longitude={107.80702} latitude={11.5475} color="red" />
        <Marker longitude={108.2615} latitude={10.9802} color="red" />
      </Map>
    </div>
  );
}

export default Mapbox;
