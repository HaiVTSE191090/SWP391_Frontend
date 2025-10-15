// src/components/search/TimeModal.tsx
import React, { useMemo, useState } from "react";
import { TimeSelection, RentalMode, getTodayDate } from "../../models/SearchModel";
import { closeModal } from "../../controller/SearchController";

type Props = {
  current: TimeSelection;
  onSave: (val: TimeSelection) => void;
};

export default function TimeModal({ current, onSave }: Props) {
  const [mode, setMode] = useState<RentalMode>(current.mode);
  const [startDate, setStartDate] = useState(current.startDate);
  const [endDate, setEndDate] = useState(current.endDate);
  const [startTime, setStartTime] = useState(current.startTime);
  const [endTime, setEndTime] = useState(current.endTime);

  const today = useMemo(() => getTodayDate(), []);

  const handleSave = () => {
    const payload: TimeSelection = {
      mode,
      startDate,
      endDate: mode === "day" ? endDate : startDate,
      startTime,
      endTime,
    };
    onSave(payload);
    closeModal("timeModal");
  };

  const displaySummary = useMemo(() => {
    if (mode === "day") {
      return `Khoảng: ${startDate} ${startTime} → ${endDate} ${endTime}`;
    }
    return `Khoảng: ${startDate} ${startTime} → ${endTime}`;
  }, [mode, startDate, endDate, startTime, endTime]);

  return (
    <div className="modal fade" id="timeModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thời gian</h5>
            <button
              id="timeModalClose"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Đóng"
            />
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
            </ul>

            {/* Bộ chọn ngày/giờ */}
            {mode === "day" ? (
              <DayModeForm
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
                today={today}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />
            ) : (
              <HourModeForm
                startDate={startDate}
                startTime={startTime}
                endTime={endTime}
                today={today}
                onStartDateChange={setStartDate}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />
            )}
          </div>

          <div className="modal-footer">
            <div className="text-muted small me-auto">{displaySummary}</div>
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= SUB-COMPONENTS =============

type DayModeFormProps = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  today: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onStartTimeChange: (val: string) => void;
  onEndTimeChange: (val: string) => void;
};

function DayModeForm({
  startDate,
  endDate,
  startTime,
  endTime,
  today,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: DayModeFormProps) {
  return (
    <>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small">Ngày nhận</label>
          <input
            type="date"
            className="form-control"
            min={today}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Ngày trả</label>
          <input
            type="date"
            className="form-control"
            min={startDate || today}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
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
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Giờ trả</label>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

type HourModeFormProps = {
  startDate: string;
  startTime: string;
  endTime: string;
  today: string;
  onStartDateChange: (val: string) => void;
  onStartTimeChange: (val: string) => void;
  onEndTimeChange: (val: string) => void;
};

function HourModeForm({
  startDate,
  startTime,
  endTime,
  today,
  onStartDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: HourModeFormProps) {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small">Ngày thuê</label>
        <input
          type="date"
          className="form-control"
          min={today}
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small">Khung giờ</label>
        <div className="d-flex gap-2">
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
          <span className="align-self-center">→</span>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}