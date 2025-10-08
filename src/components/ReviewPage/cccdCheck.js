// Danh sách tài khoản đã đăng ký
const danhSachTaiKhoan = [
  {
    cccd: "001234567890",
    ten: "NGUYỄN VĂN A",
    ngaySinh: "15/08/1990"
  },
  {
    cccd: "098765432100",
    ten: "TRẦN THỊ B", 
    ngaySinh: "10/03/1985"
  },
  {
    cccd: "555666777888",
    ten: "PHẠM THỊ C",
    ngaySinh: "05/12/1992"
  }
];

// Hàm kiểm tra CCCD có trùng không
export function kiemTraTrung(cccd) {
  const coTrung = danhSachTaiKhoan.find(taiKhoan => taiKhoan.cccd === cccd);
  return coTrung ? true : false;
}

// Hàm tính tuổi
export function tinhTuoi(ngaySinh) {
  const [ngay, thang, nam] = ngaySinh.split('/').map(Number);
  const hienTai = new Date();
  const namHienTai = hienTai.getFullYear();
  const thangHienTai = hienTai.getMonth() + 1;
  const ngayHienTai = hienTai.getDate();
  
  let tuoi = namHienTai - nam;
  
  if (thangHienTai < thang || (thangHienTai === thang && ngayHienTai < ngay)) {
    tuoi = tuoi - 1;
  }
  
  return tuoi;
}

// Hàm kiểm tra toàn bộ (trả về loại popup cần hiện)
export function kiemTraCCCD(thongTin) {
  // 1. Kiểm tra trùng CCCD
  if (kiemTraTrung(thongTin.cccd)) {
    return "duplicate"; // Hiện popup trùng lặp
  }
  
  // 2. Kiểm tra tuổi
  const tuoi = tinhTuoi(thongTin.ngaySinh);
  if (tuoi < 21) {
    return "age"; // Hiện popup không đủ tuổi
  }
  
  // 3. Nếu OK hết thì hiện popup xác nhận
  return "confirmation";
}

// Xuất ra để dùng ở file khác
export default {
  danhSachTaiKhoan,
  kiemTraTrung,
  tinhTuoi,
  kiemTraCCCD
};