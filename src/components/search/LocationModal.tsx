// src/components/search/LocationModal.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { LocationSelection, NominatimResult, SUGGESTED_AIRPORTS } from "../../models/SearchModel";
import { getCurrentPosition } from "../../controller/SearchController";

type Props = {
  current: LocationSelection;
  onSave: (loc: LocationSelection) => void;
  onClose?: () => void;
};


export default function LocationModal({ current, onSave, onClose }: Props) {
  const [value, setValue] = useState(current.label);
  const [predictions, setPredictions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!value.trim() || value.trim().length < 2) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setLoading(true);
      
      axios.get<NominatimResult[]>("https://nominatim.openstreetmap.org/search", {
        params: {
          q: `${value}, Vietnam`,
          format: "json",
          limit: 5,
          countrycodes: "vn",
          addressdetails: 1,
        },
        headers: {
          "Accept-Language": "vi",
        },
      })
        .then((response) => {
          setPredictions(response.data);
          setShowSuggestions(response.data.length > 0);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching location suggestions:", error);
          setPredictions([]);
          setShowSuggestions(false);
          setLoading(false);
        });
    }, 500); 

  }, [value]);

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
    setValue(label);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const coords = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    
    onSave({
      label: result.display_name,
      coords,
    });
    setShowSuggestions(false);
    onClose?.();
  };

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static" keyboard={true}>
      <Modal.Header closeButton>
        <Modal.Title>Chọn địa điểm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3 position-relative">
          <label className="form-label small">Nhập địa điểm</label>
          <div className="input-group">
            <input
              ref={inputRef}
              className="form-control"
              placeholder="TP. Hồ Chí Minh, Quận 1..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => value.trim().length > 0 && setShowSuggestions(true)}
            />
          </div>

          {loading && (
            <div className="position-absolute w-100 mt-1 text-center p-2 bg-white border rounded shadow" style={{ zIndex: 1050 }}>
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Đang tìm...</span>
              </div>
              <small className="ms-2 text-muted">Đang tìm kiếm...</small>
            </div>
          )}
          
          {!loading && showSuggestions && predictions.length > 0 && (
            <div className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
              <ul className="list-group shadow">
                {predictions.map((result) => (
                  <li
                    key={result.place_id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectSuggestion(result)}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">📍</span>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{result.display_name}</div>
                        <small className="text-muted">
                          {result.lat}, {result.lon}
                        </small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {!loading && showSuggestions && predictions.length === 0 && value.trim().length >= 2 && (
            <div className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
              <div className="alert alert-warning mb-0 shadow-sm">
                <small>Không tìm thấy địa điểm phù hợp</small>
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <Button variant="outline-primary" className="w-100" onClick={handleUseCurrentPosition}>
            Dùng vị trí hiện tại
          </Button>
        </div>


        <div className="mb-2 fw-semibold">Gợi ý nhanh</div>
        <div className="d-flex flex-wrap gap-2">
          {SUGGESTED_AIRPORTS.map((airport) => (
            <Button
              key={airport}
              variant="light"
              size="sm"
              className="border"
              onClick={() => handleQuickPick(airport)}
            >
              {airport}
            </Button>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleSaveText}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
