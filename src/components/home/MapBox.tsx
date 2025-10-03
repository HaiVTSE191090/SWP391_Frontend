import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocationSelection } from "./SearchBar";

const markers = [
  { name: "Quận 1 - TP.HCM", lat: 10.762622, lng: 106.660172, distance: 0 },
  { name: "Gò Vấp", lat: 10.838, lng: 106.6653, distance: 0 },
  { name: "Tân Vạn - Biên Hòa", lat: 10.902, lng: 106.823, distance: 0 },
  { name: "Bảo Lộc", lat: 11.5475, lng: 107.807, distance: 0 },
  { name: "Phan Thiết", lat: 10.9802, lng: 108.2615, distance: 0 },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type Props = {
  selectedLocation: LocationSelection | null;
};

function Mapbox({ selectedLocation }: Props) {
  const [viewState, setViewState] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 7,
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState(markers);

  // Khi chọn địa điểm mới từ SearchBar
  useEffect(() => {
    if (selectedLocation?.coords) {
      setViewState({
        latitude: selectedLocation.coords.lat,
        longitude: selectedLocation.coords.lng,
        zoom: 12,
      });
      setUserLocation(selectedLocation.coords);

      const sorted = [...markers]
        .map((m) => ({
          ...m,
          distance: haversine(
            selectedLocation.coords!.lat,
            selectedLocation.coords!.lng,
            m.lat,
            m.lng
          ),
        }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
      setSortedMarkers(sorted);
    }
  }, [selectedLocation]);

  return (
    <div className="row h-100 shadow rounded overflow-hidden">
      {/* Map bên trái */}
      <div className="col-lg-8 col-md-7 position-relative p-0 h-100">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <NavigationControl position="top-left" />

          {/* Marker user */}
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
              <div className="fs-2 text-primary">📍</div>
            </Marker>
          )}

          {/* Marker cố định */}
          {markers.map((m, i) => (
            <Marker key={i} longitude={m.lng} latitude={m.lat} anchor="bottom">
<div className="fs-2 text-danger">📍</div>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Danh sách bên phải */}
      <div className="col-lg-4 col-md-5 bg-light p-3 overflow-auto h-100 border-start">
        <h5 className="fw-bold mb-3">📌 Danh sách địa điểm</h5>
        <div className="list-group">
          {sortedMarkers.map((m, i) => (
            <button
              key={i}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() =>
                setViewState({
                  latitude: m.lat,
                  longitude: m.lng,
                  zoom: 12,
                })
              }
            >
              <span>{m.name}</span>
              {m.distance && (
                <span className="badge bg-primary rounded-pill">{m.distance.toFixed(1)} km</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mapbox;