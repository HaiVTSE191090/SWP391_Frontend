import { useState } from 'react'
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap'
import NotificationPopup from './components/NotificationPopup'
import ReviewConfirmPage from './components/ReviewConfirmPage'
// @ts-ignore
import { kiemTraCCCD } from './cccdCheck.js'

function App() {
  const [popupType, setPopupType] = useState<string | null>(null);
  const [thongTinCCCD, setThongTinCCCD] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'test' | 'review'>('test');

  // Dữ liệu test cho popup
  const duLieuTest = [
    // CCCD hợp lệ - chưa đăng ký, đủ tuổi
    {
      ten: "NGUYỄN VĂN D",
      cccd: "123123123123",
      ngaySinh: "20/05/1995",
      diaChi: "123 Đường ABC, Hà Nội"
    },
    // CCCD đã đăng ký - sẽ bị trùng
    {
      ten: "NGUYỄN VĂN A", 
      cccd: "001234567890",
      ngaySinh: "15/08/1990",
      diaChi: "456 Đường XYZ, Hà Nội"
    },
    // CCCD chưa đủ tuổi
    {
      ten: "NGUYỄN VĂN E",
      cccd: "999999999999", 
      ngaySinh: "10/10/2010",
      diaChi: "789 Đường DEF, Hà Nội"
    }
  ];

  // Dữ liệu mẫu cho trang Review (thông tin đầy đủ)
  const layThongTinDayDu = () => {
    if (thongTinCCCD) {
      // Sử dụng thông tin từ CCCD đã test + thêm thông tin mẫu
      return {
        ten: thongTinCCCD.ten,
        email: "example@gmail.com", // Mẫu
        sdt: "0987654321", // Mẫu  
        cccd: thongTinCCCD.cccd,
        gplx: "B2-123456789", // Mẫu
        ngaySinh: thongTinCCCD.ngaySinh,
        diaChi: thongTinCCCD.diaChi,
        gioiTinh: "Nam" // Mẫu
      };
    }
    
    // Fallback data
    return {
      ten: "NGUYỄN VĂN MINH",
      email: "nguyenvanminh@gmail.com",
      sdt: "0987654321",
      cccd: "123456789012",
      gplx: "B2-987654321",
      ngaySinh: "15/03/1995",
      diaChi: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      gioiTinh: "Nam"
    };
  };

  // Xử lý khi nhấn nút test
  const testCCCD = (duLieu: any) => {
    console.log('Đang kiểm tra:', duLieu);
    setThongTinCCCD(duLieu);
    
    // Kiểm tra và lấy kết quả
    const ketQua = kiemTraCCCD(duLieu);
    console.log('Kết quả:', ketQua);
    
    // Hiện popup tương ứng
    setPopupType(ketQua);
  };

  // Đóng popup
  const dongPopup = () => {
    setPopupType(null);
    setThongTinCCCD(null);
  };

  // Xử lý đồng ý - chuyển qua trang Review
  const xuLyDongY = () => {
    dongPopup(); // Đóng popup trước
    setCurrentPage('review'); // Chuyển qua trang Review
  };

  // Xử lý không đồng ý
  const xuLyKhongDongY = () => {
    alert('Vui lòng kiểm tra lại thông tin!');
    dongPopup();
  };

  // Xử lý chuyển trang
  const quayLaiTest = () => {
    setCurrentPage('test');
    setPopupType(null); // Reset popup
    setThongTinCCCD(null); // Reset dữ liệu CCCD
  };

  // Xử lý gửi đăng ký
  const guiDangKy = () => {
    alert('🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
    setCurrentPage('test');
  };

  // Xử lý chỉnh sửa
  const chinhSua = () => {
    alert('Chuyển đến trang chỉnh sửa thông tin...');
  };

  // Render trang hiện tại
  if (currentPage === 'review') {
    return (
      <ReviewConfirmPage
        userInfo={layThongTinDayDu()}
        onSubmit={guiDangKy}
        onEdit={chinhSua}
        onBack={quayLaiTest}
      />
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h1 className="mb-0">🚗 Hệ thống Thuê Xe Điện</h1>
              <h2 className="mb-0 mt-2">Kiểm tra CCCD</h2>
            </Card.Header>
            <Card.Body>
              <Row className="g-3 mb-4">
                <Col md={4}>
                  <Button 
                    variant="success"
                    size="lg"
                    className="w-100"
                    onClick={() => testCCCD(duLieuTest[0])}
                  >
                    Test CCCD Hợp lệ
                  </Button>
                </Col>
                
                <Col md={4}>
                  <Button 
                    variant="warning"
                    size="lg"
                    className="w-100"
                    onClick={() => testCCCD(duLieuTest[1])}
                  >
                    Test CCCD Đã đăng ký
                  </Button>
                </Col>
                
                <Col md={4}>
                  <Button 
                    variant="danger"
                    size="lg"
                    className="w-100"
                    onClick={() => testCCCD(duLieuTest[2])}
                  >
                    Test CCCD Chưa đủ tuổi
                  </Button>
                </Col>
              </Row>

              <Alert variant="info">
                <Alert.Heading>Cách hoạt động:</Alert.Heading>
                <p className="mb-1">1. Sau khi OCR/nhập tay xong thông tin CCCD</p>
                <p className="mb-1">2. Hệ thống kiểm tra trùng lặp và tuổi</p>
                <p className="mb-0">3. Hiện popup tương ứng</p>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <NotificationPopup
        type={popupType as 'duplicate' | 'age' | 'confirmation' | null}
        isOpen={popupType !== null}
        onClose={dongPopup}
        onConfirm={xuLyDongY}
        onReject={xuLyKhongDongY}
        data={thongTinCCCD}
      />
    </Container>
  )
}

export default App
