// src/components/search/SearchBar.tsx
import React, { useMemo, useState } from "react";

export type GeoPoint = { lat: number; lng: number } | null;

export type LocationSelection = {
  label: string;      // ví dụ: "TP. Hồ Chí Minh" hoặc "Vị trí hiện tại"
  coords: GeoPoint;   // có thể null nếu nhập tay
};

export type RentalMode = "day" | "hour";

export type TimeSelection = {
  mode: RentalMode;
  startDate: string;  // yyyy-mm-dd
  endDate: string;    // yyyy-mm-dd (mode=hour thì endDate = startDate)
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
};

type Props = {
  onSearch?: (loc: LocationSelection, time: TimeSelection) => void;
};

export default function SearchBar({ onSearch }: Props) {
  // --- state mặc định
  const [location, setLocation] = useState<LocationSelection>({
    label: "TP. Hồ Chí Minh",
    coords: null,
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [timeSel, setTimeSel] = useState<TimeSelection>({
    mode: "day",
    startDate: today,
    endDate: today,
    startTime: "09:00",
    endTime: "20:00",
  });

  const displayTime = useMemo(() => {
    const d = (s: string) => s.split("-").reverse().join("/"); // dd/mm/yyyy
    if (timeSel.mode === "day") {
      return `${timeSel.startTime}, ${d(timeSel.startDate)} - ${timeSel.endTime}, ${d(
        timeSel.endDate
      )}`;
    }
    return `${timeSel.startTime} - ${timeSel.endTime}, ${d(timeSel.startDate)}`;
  }, [timeSel]);

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

          {/* Tìm xe */}
          <div className="col-12 col-md-2 d-grid">
            <button
              className="btn btn-success btn-lg"
              onClick={() => onSearch?.(location, timeSel)}
            >
              Tìm xe
            </button>
          </div>
        </div>
      </div>

      {/* POPUPS */}
      <LocationModal
        current={location}
        onSave={(loc) => setLocation(loc)}
      />
      <TimeModal
        current={timeSel}
        onSave={(t) => setTimeSel(t)}
      />
    </section>
  );
}

/* ---------------- Location Modal ---------------- */

type LocationModalProps = {
  current: LocationSelection;
  onSave: (val: LocationSelection) => void;
};

function LocationModal({ current, onSave }: LocationModalProps) {
  const [value, setValue] = useState(current.label);

  const suggestAirports = [
    "Tân Sơn Nhất",
    "Nội Bài",
    "Đà Nẵng",
    "Cam Ranh",
    "Phú Quốc",
    "Liên Khương",
  ];

  const useCurrentPosition = () => {
    if (!("geolocation" in navigator)) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onSave({ label: "Vị trí hiện tại", coords });
        // đóng modal
        (document.getElementById("locationModalClose") as HTMLButtonElement)?.click();
      },
      () => alert("Không lấy được vị trí. Hãy nhập tay hoặc thử lại.")
    );
  };

  const saveText = () => {
    onSave({ label: value.trim() || "TP. Hồ Chí Minh", coords: null });
    (document.getElementById("locationModalClose") as HTMLButtonElement)?.click();
  };

  const quickPick = (label: string) => {
    onSave({ label, coords: null });
    (document.getElementById("locationModalClose") as HTMLButtonElement)?.click();
  };

  return (
    <div className="modal fade" id="locationModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Địa điểm</h5>
            <button id="locationModalClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Đóng" />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label small">Nhập địa điểm</label>
              <div className="input-group">
                <span className="input-group-text">📍</span>
                <input
                  className="form-control"
                  placeholder="TP. Hồ Chí Minh, Quận 1..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {value && (
                  <button className="btn btn-outline-secondary" onClick={() => setValue("")}>
                    ✖
                  </button>
                )}
              </div>
            </div>

            <div className="mb-3">
              <button className="btn btn-outline-primary w-100" onClick={useCurrentPosition}>
                Dùng vị trí hiện tại
              </button>
            </div>

            <div className="mb-2 fw-semibold">Gợi ý nhanh (sân bay/điểm hot)</div>
            <div className="d-flex flex-wrap gap-2">
              {suggestAirports.map((a) => (
                <button key={a} className="btn btn-light border" onClick={() => quickPick(a)}>
                  ✈️ {a}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button className="btn btn-success" onClick={saveText}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Time Modal ---------------- */

type TimeModalProps = {
  current: TimeSelection;
  onSave: (val: TimeSelection) => void;
};

function TimeModal({ current, onSave }: TimeModalProps) {
  const [mode, setMode] = useState<RentalMode>(current.mode);
  const [startDate, setStartDate] = useState(current.startDate);
  const [endDate, setEndDate] = useState(current.endDate);
  const [startTime, setStartTime] = useState(current.startTime);
  const [endTime, setEndTime] = useState(current.endTime);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const save = () => {
    const payload: TimeSelection = {
      mode,
      startDate,
      endDate: mode === "day" ? endDate : startDate,
      startTime,
      endTime,
    };
    onSave(payload);
    (document.getElementById("timeModalClose") as HTMLButtonElement)?.click();
  };

  return (
    <div className="modal fade" id="timeModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thời gian</h5>
            <button id="timeModalClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Đóng" />
          </div>

          <div className="modal-body">
            {/* Tabs chọn chế độ */}
            <ul className="nav nav-pills gap-2 mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${mode === "day" ? "active" : ""}`}
                  onClick={() => setMode("day")}
                >
                  Thuê theo ngày
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${mode === "hour" ? "active" : ""}`}
                  onClick={() => setMode("hour")}
                >
                  Thuê theo giờ
                </button>
              </li>
            </ul>

            {/* Bộ chọn ngày/giờ đơn giản (dùng input HTML) */}
            {mode === "day" ? (
              <>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Ngày nhận</label>
                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Ngày trả</label>
                    <input
                      type="date"
                      className="form-control"
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label small">Giờ nhận</label>
                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Giờ trả</label>
                    <input
                      type="time"
                      className="form-control"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Ngày thuê</label>
                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Khung giờ</label>
                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <span className="align-self-center">→</span>
                      <input
                        type="time"
                        className="form-control"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <div className="text-muted small me-auto">
              {mode === "day"
                ? `Khoảng: ${startDate} ${startTime} → ${endDate} ${endTime}`
                : `Khoảng: ${startDate} ${startTime} → ${endTime}`}
            </div>
            <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button className="btn btn-success" onClick={save}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
