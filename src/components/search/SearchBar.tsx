// src/components/search/SearchBar.tsx
import React, { useMemo, useState } from "react";
import {
  LocationSelection,
  TimeSelection,
  DEFAULT_LOCATION,
  getDefaultTimeSelection,
  formatTimeDisplay,
  getTodayDate,
} from "../../models/SearchModel";
import { processSearch } from "../../controller/SearchController";
import LocationModal from "./LocationModal";
import TimeModal from "./TimeModal";

type Props = {
  onSearch?: (loc: LocationSelection, time: TimeSelection) => void;
  onLocationDenied?: () => void;
};

export default function SearchBar({ onSearch, onLocationDenied }: Props) {
  const [location, setLocation] = useState<LocationSelection>(DEFAULT_LOCATION);
  const [timeSel, setTimeSel] = useState<TimeSelection>(getDefaultTimeSelection());
  const [showLocationModal, setShowLocationModal] = useState(false); // popup nhập tay

  const displayTime = useMemo(() => formatTimeDisplay(timeSel), [timeSel]);


  //Khi nhấn tìm trạm"
  const handleSearchClick = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị. Hãy nhập địa điểm ở bên dưới danh sách.");
      onLocationDenied?.();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const userLocation: LocationSelection = {
          label: "Vị trí hiện tại",
          coords,
        };

        setLocation(userLocation);
        onSearch?.(userLocation, timeSel);
      },
      (error) => {
        console.warn("Không thể truy cập vị trí người dùng:", error.message);
        alert("Không thể truy cập vị trí. Vui lòng nhập địa điểm thủ công ở bên dưới danh sách.");
        onLocationDenied?.(); // 👈 báo cho MapBox biết
      },
      { timeout: 5000 }
    );
  };

  return (
    <section className="container">
      <div className="bg-white rounded-4 shadow p-3">
        <div className="row align-items-end">
          {/* Thời gian */}
          <div className="col-12 col-md-9">
            <label className="text-muted small d-block mb-1">Thời gian thuê</label>
            <button
              className="btn w-100 text-start border rounded-3 py-2"
              data-bs-toggle="modal"
              data-bs-target="#timeModal"
            >
              <span className="me-2">🗓️</span>
              {displayTime}
              <span className="float-end">▾</span>
            </button>
          </div>

          {/* Tìm trạm */}
          <div className="col-12 col-md-3 d-grid mt-2 mt-md-0">
            <button className="btn btn-success btn-lg" onClick={handleSearchClick}>
              Tìm trạm
            </button>
          </div>
        </div>
      </div>

      {/* POPUPS */}
      <TimeModal current={timeSel} onSave={setTimeSel} />

    </section>
  );
}
export type { LocationSelection, TimeSelection } from "../../models/SearchModel";
