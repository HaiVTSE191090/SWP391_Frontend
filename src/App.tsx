import React from "react";

/** UI only – no data fetching/state logic
 * Tailwind classes used. Replace by your CSS if needed.
 * TODO: Replace all gray boxes with <img src="..." alt="..." />
 */

type Vehicle = {
  id: string;
  name: string;
  variant?: string;
  pricePerDay: string; // formatted
  seats?: number;
  fuel?: string;
  transmission?: string;
  distance?: string;
  location?: string;
};

const vehicles: Vehicle[] = [
  { id: "v1", name: "VinFast VF7", variant: "Plus", pricePerDay: "1.000.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "2.4 km", location: "Q.1, HCM" },
  { id: "v2", name: "VinFast VF6", variant: "Base", pricePerDay: "950.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "1.8 km", location: "Q.3, HCM" },
  { id: "v3", name: "VinFast VF8", variant: "Plus", pricePerDay: "1.500.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "3.1 km", location: "Q.7, HCM" },
  { id: "v4", name: "KIA EV6", variant: "GT-Line", pricePerDay: "1.600.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "2.0 km", location: "Q.10, HCM" },
  { id: "v5", name: "Hyundai Ioniq 5", variant: "Prestige", pricePerDay: "1.450.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "4.2 km", location: "Thủ Đức" },
  { id: "v6", name: "Toyota Yaris Cross HEV", variant: "Hybrid", pricePerDay: "900.000₫/ngày", seats: 5, fuel: "HEV", transmission: "AT", distance: "2.7 km", location: "Phú Nhuận" },
  { id: "v7", name: "Mazda 3", variant: "Sedan", pricePerDay: "700.000₫/ngày", seats: 5, fuel: "ICE", transmission: "AT", distance: "1.1 km", location: "Q.5, HCM" },
  { id: "v8", name: "Honda City", variant: "RS", pricePerDay: "650.000₫/ngày", seats: 5, fuel: "ICE", transmission: "AT", distance: "3.9 km", location: "Gò Vấp" },
  { id: "v9", name: "VinFast VF5", variant: "Plus", pricePerDay: "800.000₫/ngày", seats: 5, fuel: "EV", transmission: "AT", distance: "2.2 km", location: "Q.2, HCM" },
];

interface SectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ title, subtitle, className, children }) => (
  <section className={"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 " + (className ?? "")}>
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border text-gray-700">{children}</span>
);

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* TODO: image - logo */}
            <div className="w-9 h-9 rounded-lg bg-gray-200" aria-label="Logo placeholder" />
            <span className="font-semibold">EV Rental</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#advantages" className="hover:text-gray-900">Ưu điểm</a>
            <a href="#howto" className="hover:text-gray-900">Hướng dẫn</a>
            <a href="#catalog" className="hover:text-gray-900">Danh sách xe</a>
          </nav>
        </div>
      </header>

      {/* Advantages */}
      <div id="advantages" className="bg-gray-100 py-10">
        <Section
          title="Ưu Điểm Của EV Rental"
          subtitle="Những tính năng giúp bạn dễ dàng hơn khi thuê xe điện"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  {/* TODO: image - advantage illustration */}
                  <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" aria-label="Advantage icon" />
                  <div>
                    {i === 0 && (
                      <>
                        <h3 className="font-semibold">Thủ tục đơn giản</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Đặt xe nhanh gọn, xác minh trực tuyến. Không cần thế chấp rườm rà.
                        </p>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <h3 className="font-semibold">Thanh toán dễ dàng</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Hỗ trợ ví điện tử, thẻ ngân hàng, chuyển khoản; xuất hoá đơn theo yêu cầu.
                        </p>
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <h3 className="font-semibold">Tìm điểm thuê dễ dàng</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Chọn trạm gần bạn trên bản đồ, xem trạng thái xe theo thời gian thực.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* How to rent */}
      <div id="howto" className="py-12">
        <Section
          title="Hướng Dẫn Thuê Xe"
          subtitle="Chỉ với 4 bước đơn giản để trải nghiệm thuê xe nhanh chóng"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                {/* TODO: image - step illustration */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4" aria-label="Step illustration" />
                {i === 0 && (
                  <>
                    <h4 className="font-semibold">Bước 1: Chọn xe & vị trí</h4>
                    <p className="text-sm text-gray-600 mt-1">Xem thông tin xe, so sánh giá.</p>
                  </>
                )}
                {i === 1 && (
                  <>
                    <h4 className="font-semibold">Bước 2: Đặt xe & xác nhận</h4>
                    <p className="text-sm text-gray-600 mt-1">Chọn thời gian, đọc điều khoản.</p>
                  </>
                )}
                {i === 2 && (
                  <>
                    <h4 className="font-semibold">Bước 3: Nhận xe & kiểm tra</h4>
                    <p className="text-sm text-gray-600 mt-1">Ký biên nhận, quay/chụp tình trạng.</p>
                  </>
                )}
                {i === 3 && (
                  <>
                    <h4 className="font-semibold">Bước 4: Trả xe & đánh giá</h4>
                    <p className="text-sm text-gray-600 mt-1">Kết thúc chuyến, thanh toán còn lại.</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Catalog */}
      <div id="catalog" className="py-12 bg-gray-100">
        <Section title="Danh sách xe">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <article key={v.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{v.name}</h3>
                      <p className="text-sm text-gray-500">{v.variant}</p>
                    </div>
                    <button aria-label="Yêu thích" className="p-2 rounded-full hover:bg-gray-100">
                      {/* TODO: image/icon - heart */}
                      <div className="w-5 h-5 bg-gray-300 rounded" />
                    </button>
                  </div>
                </div>

                {/* TODO: image - vehicle picture */}
                <div className="h-40 bg-gray-200" aria-label="Vehicle image" />

                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-gray-900 font-semibold">{v.pricePerDay}</div>
                    <div className="flex flex-wrap gap-2 text-gray-600">
                      {v.seats && <Tag>{v.seats} chỗ</Tag>}
                      {v.fuel && <Tag>{v.fuel}</Tag>}
                      {v.transmission && <Tag>{v.transmission}</Tag>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {v.location} · {v.distance}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:opacity-90">
                      Thuê ngay
                    </button>
                    <button className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>
      </div>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EV Rental — UI demo
      </footer>
    </div>
  );
}
