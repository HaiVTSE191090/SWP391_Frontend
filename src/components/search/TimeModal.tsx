import React, { useEffect, useMemo, useState } from "react";
import { TimeSelection, getDateAfterDays } from "../../models/SearchModel";
import { closeModal } from "../../controller/SearchController";

type Props = {
  current: TimeSelection;
  onSave: (val: TimeSelection) => void;
};

export default function TimeModal({ current, onSave }: Props) {
  const [startDate, setStartDate] = useState(current.startDate);
  const [endDate, setEndDate] = useState(current.endDate);
  const [startTime, setStartTime] = useState(current.startTime);
  const [endTime, setEndTime] = useState(current.endTime);

  useEffect(() => {
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setEndDate(nextDay.toISOString().slice(0, 10));
  }, [startDate]);

  const minStartDate = useMemo(() => getDateAfterDays(7), []);
  const maxStartDate = useMemo(() => getDateAfterDays(14), []);
  
  const minEndDate = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, [startDate]);
  
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    setEndTime(newStartTime); 
  };

  const handleSave = () => {
    if (startDate < minStartDate) {
      alert(`Ngày nhận xe phải từ ${minStartDate} trở đi (7 ngày sau hôm nay)`);
      return;
    }

    if (startDate > maxStartDate) {
      alert(`Ngày nhận xe không được quá ${maxStartDate} (14 ngày kể từ hôm nay)`);
      return;
    }

    if (endDate <= startDate) {
      alert("Ngày trả xe phải sau ngày nhận xe");
      return;
    }

    if (endDate > maxStartDate) {
      alert(`Ngày trả xe không được quá ${maxStartDate} (14 ngày kể từ hôm nay)`);
      return;
    }

    const payload: TimeSelection = {
      mode: "day",
      startDate,
      endDate,
      startTime,
      endTime,
    };
    onSave(payload);
    closeModal("timeModal");
  };

  const displaySummary = useMemo(() => {
    return `Khoảng: ${startDate} ${startTime} → ${endDate} ${endTime}`;
  }, [startDate, endDate, startTime, endTime]);

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
            <DayModeForm
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              minStartDate={minStartDate}
              maxStartDate={maxStartDate}
              minEndDate={minEndDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={setEndTime}
            />
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
  minStartDate: string;
  maxStartDate: string;
  minEndDate: string;
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
  minStartDate,
  maxStartDate,
  minEndDate,
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
            min={minStartDate}
            max={maxStartDate}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <small className="text-muted">7-14 ngày kể từ hôm nay</small>
        </div>
        <div className="col-md-6">
          <label className="form-label small">Ngày trả</label>
          <input
            type="date"
            className="form-control"
            min={minEndDate}
            max={maxStartDate}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
          <small className="text-muted">Tối thiểu 1 ngày sau ngày nhận</small>
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
            disabled
          />
        </div>
      </div>
    </>
  );
}