import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocationSelection } from "../../models/SearchModel";
import { useStation } from "../../hooks/useStation";
import LocationModal from "../search/LocationModal";
import VehicleList from "../vehicle/VehicleList";

type Props = {
  selectedLocation: LocationSelection | null;
  onLocationChange?: (location: LocationSelection) => void;
};

function Mapbox({ selectedLocation, onLocationChange }: Props) {
  const { sortedStations, loading, error, calculateDistance, resetDistance } = useStation();
  const [viewState, setViewState] = useState({ latitude: 10.762622, longitude: 106.660172, zoom: 7 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState<LocationSelection | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedLocation?.coords) {
      setViewState({ latitude: selectedLocation.coords.lat, longitude: selectedLocation.coords.lng, zoom: 12, });
      setUserLocation(selectedLocation.coords);
      calculateDistance(selectedLocation);
    }
  }, [selectedLocation, calculateDistance]);

  const handleManualSave = (loc: LocationSelection) => {
    setManualLocation(loc);
    setShowLocationModal(false);


    if (onLocationChange) {
      onLocationChange(loc);
    }

    if (loc.coords) {
      setViewState({
        latitude: loc.coords.lat,
        longitude: loc.coords.lng,
        zoom: 12,
      });
      setUserLocation(loc.coords);
      calculateDistance(loc);
    }
  };

  const isStationAtUserLocation = (station: any) => {
    const userLoc = manualLocation?.coords || selectedLocation?.coords;
    if (!userLoc) return false;

    const latDiff = Math.abs(station.latitude - userLoc.lat);
    const lngDiff = Math.abs(station.longitude - userLoc.lng);

    return latDiff < 0.001 && lngDiff < 0.001;
  };

  const handleStationClick = (stationId: number) => {
    setSelectedStationId(stationId);
  };

  return (
    <div className="row h-100 shadow rounded overflow-hidden">
      <div className="col-lg-8 col-md-7 position-relative p-0 h-100">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        >
          <NavigationControl position="top-left" />

          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
              <div className="fs-2 text-primary">⭐</div>
            </Marker>
          )}

          {sortedStations
            .filter(station => !isStationAtUserLocation(station))
            .map((station) => (
              <Marker
                key={station.stationId}
                longitude={station.longitude}
                latitude={station.latitude}
                anchor="bottom"
              >
                <div className="fs-2 text-danger" title={station.name}>📍</div>
              </Marker>
            ))}

          {manualLocation?.coords && (
            <Marker
              longitude={manualLocation.coords.lng}
              latitude={manualLocation.coords.lat}
              anchor="bottom"
            >
              <div className="fs-2 text-warning">⭐</div>
            </Marker>
          )}
        </Map>
      </div>

      <div className="col-lg-4 col-md-5 bg-light p-3 overflow-auto h-100 border-start">
        <h5 className="fw-bold mb-3"> Danh sách trạm</h5>

        {loading && <div className="text-center py-3">Đang tải...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {(selectedLocation?.label || manualLocation?.label) && (
          <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong>Vị trí của bạn:</strong>
              <div className="mt-1">{manualLocation?.label || selectedLocation?.label}</div>
            </div>
            {(manualLocation || selectedLocation) && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setManualLocation(null);
                  setUserLocation(null);
                  resetDistance();
                  onLocationChange!({ label: "", coords: null });
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="list-group mb-3">
          <button
            className="list-group-item list-group-item-action text-center text-success fw-semibold"
            onClick={() => setShowLocationModal(true)}
          >
            ➕ Nhập địa điểm của bạn
          </button>
          {sortedStations
            .filter(station => !isStationAtUserLocation(station))
            .map((station) => (
              <button
                key={station.stationId}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => {
                  setViewState({
                    latitude: station.latitude,
                    longitude: station.longitude,
                    zoom: 14,
                  });
                  handleStationClick(station.stationId);
                }}
              >
                <div>
                  <div className="fw-semibold">{station.name}</div>
                  <small className="text-muted">{station.location}</small>
                  <div className="mt-1">
                    <span className="badge bg-info me-1">
                      {station.availableCount || 0} xe
                    </span>
                    <span className={`badge ${station.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                      {station.status}
                    </span>
                  </div>
                </div>
                {station.distance !== null && (
                  <span className="badge bg-primary rounded-pill">
                    {station.distance.toFixed(1)} km
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>

      {selectedStationId && (
        <div className="col-12">
          <VehicleList stationId={selectedStationId} title={`Xe tại ${sortedStations.find(s => s.stationId === selectedStationId)?.name}`} />
        </div>
      )}

      {showLocationModal && (
        <LocationModal
          current={manualLocation || { label: "", coords: null }}
          onSave={handleManualSave}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
}

export default Mapbox;
