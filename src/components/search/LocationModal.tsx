// src/components/search/LocationModal.tsx
import React, { useState } from "react";
import { LocationSelection, SUGGESTED_AIRPORTS } from "../../models/SearchModel";
import { getCurrentPosition, closeModal } from "../../controller/SearchController";

type Props = {
    current: LocationSelection;
    onSave: (val: LocationSelection) => void;
};

export default function LocationModal({ current, onSave }: Props) {
    const [value, setValue] = useState(current.label);

    const handleUseCurrentPosition = async () => {
        try {
            const coords = await getCurrentPosition();
            onSave({ label: "Vị trí hiện tại", coords });
            closeModal("locationModal");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Lỗi không xác định");
        }
    };

    const handleSaveText = () => {
        onSave({ label: value.trim() || "TP. Hồ Chí Minh", coords: null });
        closeModal("locationModal");
    };

    const handleQuickPick = (label: string) => {
        onSave({ label, coords: null });
        closeModal("locationModal");
    };

    const handleClearInput = () => {
        setValue("");
    };

    return (
        <div className="modal fade" id="locationModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Địa điểm</h5>
                        <button
                            id="locationModalClose"
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Đóng"
                        />
                        
                    </div>

                    <div className="modal-body">
                        {/* Input địa điểm */}
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
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleClearInput}
                                    >
                                        ✖
                                    </button>
                                )}
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
                        <div className="mb-2 fw-semibold">Gợi ý nhanh (sân bay/điểm hot)</div>
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
                        <button className="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button className="btn btn-success" onClick={handleSaveText}>
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


