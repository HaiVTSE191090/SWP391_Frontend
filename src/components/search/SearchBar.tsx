// src/components/search/SearchBar.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  LocationSelection,
  TimeSelection,
  DEFAULT_LOCATION,
  getDefaultTimeSelection,
  formatTimeDisplay,
} from "../../models/SearchModel";

import TimeModal from "./TimeModal";

type Props = {
  onSearch?: (loc: LocationSelection, time: TimeSelection) => void;
  onLocationDenied?: () => void;
};

export default function SearchBar({ onSearch, onLocationDenied }: Props) {
  const [location, setLocation] = useState<LocationSelection>(DEFAULT_LOCATION);
  const [timeSel, setTimeSel] = useState<TimeSelection>(getDefaultTimeSelection());
  const displayTime = useMemo(() => formatTimeDisplay(timeSel), [timeSel]);
  
  useEffect(() => {
    if (onSearch) {
      onSearch(location, timeSel);
    }
  }, [timeSel, location, onSearch]);

  return (
    <section className="container">
      <div className="bg-white rounded-4 shadow p-3">
        <div className="row align-items-end">
          <div className="col-12">
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
        </div>
      </div>

      <TimeModal current={timeSel} onSave={setTimeSel} />

    </section>
  );
}
export type { LocationSelection, TimeSelection } from "../../models/SearchModel";
