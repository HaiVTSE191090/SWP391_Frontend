// src/components/search/LocationModal.tsx
import React, { useState } from "react";
import { LocationSelection, SUGGESTED_AIRPORTS } from "../../models/SearchModel";
import { getCurrentPosition } from "../../controller/SearchController";

type Props = {
  current: LocationSelection;
  onSave: (loc: LocationSelection) => void;
  onClose?: () => void;
};

export default function LocationModal({ current, onSave, onClose }: Props) {
  const [value, setValue] = useState(current.label);

  const handleUseCurrentPosition = async () => {
    try {
      const coords = await getCurrentPosition();
      onSave({ label: "Vị trí hiện tại", coords });
      onClose?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể lấy vị trí hiện tại");
    }
  };

  const handleSaveText = () => {
    onSave({ label: value.trim() || "TP. Hồ Chí Minh", coords: null });
    onClose?.();
  };

  const handleQuickPick = (label: string) => {
    onSave({ label, coords: null });
    onClose?.();
  };

  return (
    <>
      {/* Overlay mờ */}
      <div className="modal-backdrop fade show"></div>

      {/* Popup modal */}
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Địa điểm</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {/* Nhập địa điểm */}
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
                </div>
              </div>

              {/* Nút sử dụng vị trí hiện tại */}
              <div className="mb-3">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={handleUseCurrentPosition}
                >
                  Dùng vị trí hiện tại
                </button>
              </div>

              {/* Gợi ý nhanh */}
              <div className="mb-2 fw-semibold">Gợi ý nhanh (sân bay / điểm hot)</div>
              <div className="d-flex flex-wrap gap-2">
                {SUGGESTED_AIRPORTS.map((airport) => (
                  <button
                    key={airport}
                    className="btn btn-light border"
                    onClick={() => handleQuickPick(airport)}
                  >
                    ✈️ {airport}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button className="btn btn-success" onClick={handleSaveText}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
