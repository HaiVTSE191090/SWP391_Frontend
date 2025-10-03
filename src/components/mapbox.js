import React, { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function Mapbox() {
  const [viewState, setViewState] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 13,
  });

  const [userLocation, setUserLocation] = useState(null);

  // 🔥 Hàm lấy vị trí hiện tại
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setViewState({
            latitude,
            longitude,
            zoom: 15, // zoom gần hơn khi tìm thấy vị trí
          });
        },
        (err) => {
          console.error("Không lấy được vị trí:", err);
          alert("Không thể lấy vị trí của bạn!");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ GPS");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Nút lấy vị trí hiện tại */}
      <button
        onClick={getCurrentLocation}
        style={{
          position: "absolute",
          zIndex: 1,
          top: 10,
          right: 10,
          padding: "8px 12px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        📍 Lấy vị trí của tôi
      </button>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" // style free
      >
        <NavigationControl position="top-left" />

        {/* Các Marker cố định */}
        <Marker longitude={106.660172} latitude={10.762622} color="red" />
        <Marker longitude={106.6653} latitude={10.8380} color="red" />
        <Marker longitude={106.8230} latitude={10.9020} color="red" />
        <Marker longitude={107.80702} latitude={11.5475} color="red" />
        <Marker longitude={108.2615} latitude={10.9802} color="red" />

        {/* Marker vị trí hiện tại của user */}
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            color="blue"
          />
        )}
      </Map>
    </div>
  );
}

export default Mapbox;
