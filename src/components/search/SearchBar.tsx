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
};

export default function SearchBar({ onSearch }: Props) {
  const [location, setLocation] = useState<LocationSelection>(DEFAULT_LOCATION);
  const [timeSel, setTimeSel] = useState<TimeSelection>(getDefaultTimeSelection());

  const displayTime = useMemo(() => formatTimeDisplay(timeSel), [timeSel]);

  const handleSearchClick = async () => {
    const processedLocation = await processSearch(location);
    onSearch?.(processedLocation, timeSel);
  };

  return (
    <section className="container">
      <div className="bg-white rounded-4 shadow p-3">
        <div className="row g-3 align-items-center">
          {/* Địa điểm */}
          <div className="col-12 col-md-5">
            <label className="text-muted small d-block mb-1">Địa điểm</label>
            <button
              className="btn w-100 text-start border rounded-3 py-2"
              data-bs-toggle="modal"
              data-bs-target="#locationModal"
            >
              <span className="me-2">📍</span>
              {location.label}
              <span className="float-end">▾</span>
            </button>
          </div>

          {/* Thời gian */}
          <div className="col-12 col-md-5">
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
          <div className="col-12 col-md-2 d-grid">
            <button className="btn btn-success btn-lg" onClick={handleSearchClick}>
              Tìm trạm
            </button>
          </div>
        </div>
      </div>

      {/* POPUPS */}
      <LocationModal current={location} onSave={setLocation} />
      <TimeModal current={timeSel} onSave={setTimeSel} />
    </section>
  );
}

// Export types cho các component khác sử dụng
export type { LocationSelection, TimeSelection} ;

