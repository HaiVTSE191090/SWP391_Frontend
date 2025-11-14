// src/components/search/SearchBar.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  LocationSelection,
  TimeSelection,
  DEFAULT_LOCATION,
  getDefaultTimeSelection,
  formatTimeDisplay,
} from "../../models/SearchModel";
import { usePolicy } from "../../hooks/usePolicy"; // Đảm bảo bạn có cái này
import { getDateAfterDays } from "../../models/SearchModel"; // Và cái này

import TimeModal from "./TimeModal";

type Props = {
  onSearch?: (loc: LocationSelection, time: TimeSelection) => void;
  onLocationDenied?: () => void;
};

export default function SearchBar({ onSearch, onLocationDenied }: Props) {
  const [location, setLocation] = useState<LocationSelection>(DEFAULT_LOCATION);
  const { getPolicyAcitveByPolicyType } = usePolicy();
  const fetchPolicyDay = useCallback(async () => {
    try {
      const res = await getPolicyAcitveByPolicyType("MIN_DAYS_BEFORE_BOOKING");
      const res3 = await getPolicyAcitveByPolicyType("MAX_RENTAL_DAYS");

      // Trả về giá trị đã parse và có fallback
      const minDay = Number(res?.data?.value) || 0;
      const maxRental = Number(res3?.data?.value) || 1;

      return { minDay, maxRental };

    } catch (error) {
      console.error("Lỗi khi fetch policy, dùng giá trị mặc định", error);
      return { minDay: 0, maxRental: 1 }; // Fallback nếu API sập
    }
  }, [getPolicyAcitveByPolicyType]);

  useEffect(() => {
    let isMounted = true;

    const setDefaultTime = async () => {
      // Gọi hàm async của bạn
      const { minDay } = await fetchPolicyDay();

      // Tính toán ngày tháng
      const startDate = getDateAfterDays(minDay);
      // Ví dụ: minDay=2, maxRental=7 -> endDate là 9 ngày sau
      const endDate = getDateAfterDays(minDay + 1);

      // Set state khi đã có data
      if (isMounted) {
        setTimeSel({
          mode: "day",
          startDate: startDate,
          endDate: endDate,
          startTime: "09:00",
          endTime: "09:00", // Giờ mới của bạn
        });
      }
    };

    setDefaultTime();

    return () => { isMounted = false; };
  }, [fetchPolicyDay]); // Chỉ chạy 1 lần khi 'fetchPolicyDay' được tạo

  const [timeSel, setTimeSel] = useState<TimeSelection | null>(null);
  const displayTime = useMemo(() => {
    // Nếu timeSel là null (khi mới load), hiển thị placeholder
    if (!timeSel) {
      return "--:--, --/--/---- - --:--, --/--/----"; // Hoặc "Đang tải..."
    }
    return formatTimeDisplay(timeSel);
  }, [timeSel]);
  useEffect(() => {
    // Chỉ 'onSearch' KHI timeSel đã có giá trị (không còn là null)
    if (onSearch && timeSel) {
      onSearch(location, timeSel);
    }
  }, [timeSel, location, onSearch]);

  return (
    <section className="container">
      <div className="bg-white rounded-4 shadow p-3">
        <div className="row align-items-end">
          <div className="col-12">
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
        </div>
      </div>

      {timeSel && <TimeModal current={timeSel} onSave={setTimeSel} />}
    </section>
  );
}
export type { LocationSelection, TimeSelection } from "../../models/SearchModel";
