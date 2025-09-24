import { useState } from "react";
import '../../App.css';
 


function BookingForm() {
  // State cho date, time, duration
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("hours");


  // State popup
  const [showGpsPopup, setShowGpsPopup] = useState(false);
  const [gpsDenied, setGpsDenied] = useState(false);


  // State địa chỉ nhập tay
  const [manualAddress, setManualAddress] = useState("");


  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-5 shadow-lg border-0 rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 fw-bold">CHỌN NGÀY VÀ GIỜ THUÊ</h3>


        {/* Ngày bắt đầu */}
        <div className="form-floating mb-3">
          <input
            type="date"
            className="form-control shadow-lg"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label htmlFor="dateInput">Ngày bắt đầu</label>
        </div>


        {/* Giờ bắt đầu */}
        <div className="form-floating mb-3">
          <input
            type="time"
            className="form-control shadow-lg"
            id="timeInput"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <label htmlFor="timeInput">Giờ bắt đầu</label>
        </div>


        {/* Thời lượng thuê */}
        <div className="form-floating mb-3">
          <input
            type="number"
            className="form-control shadow-lg"
            id="durationInput"
            placeholder="Nhập số"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <label htmlFor="durationInput">Thời lượng thuê(theo ngày)</label>
        </div>



        {/* Nút tiếp tục */}
        <div className="text-center">
          <button
            className="btn btn-primary w-100 py-2 rounded-3"
            onClick={() => setShowGpsPopup(true)}
            disabled={!date || !time || !duration}
          >
            Tiếp tục
          </button>
        </div>
      </div>


      {/* Popup GPS */}
      {showGpsPopup && !gpsDenied && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Quyền truy cập vị trí</h5>
                <button className="btn-close" onClick={() => setShowGpsPopup(false)}></button>
              </div>
              <div className="modal-body">
                <p>Ứng dụng cần truy cập GPS để xác định điểm xuất phát.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setGpsDenied(true)}>
                  Từ chối
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    alert("Đã cho phép GPS ✅");
                    setShowGpsPopup(false);
                  }}
                >
                  Cho phép
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Form nhập tay địa chỉ (khi từ chối GPS) */}
      {gpsDenied && (
        <div className="modal d-block border-dark" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-1 border-dark rounded-3 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">📍 Nhập địa chỉ xuất phát</h5>
                <button className="btn-close" onClick={() => setGpsDenied(false)}></button>
              </div>


              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Vui lòng nhập địa chỉ bạn muốn bắt đầu chuyến đi.
                </p>
                <div className="input-group rounded-3">
                 
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập địa chỉ (VD: 123 Lê Lợi, Quận 1)"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                  />
                </div>
              </div>


              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary px-4" onClick={() => setGpsDenied(false)}>
                  Hủy
                </button>
                <button
                  className="btn btn-success px-4"
                  disabled={!manualAddress}
                  onClick={() => {
                    alert("Địa chỉ đã lưu: " + manualAddress);
                    setGpsDenied(false);
                    setShowGpsPopup(false);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default BookingForm;
