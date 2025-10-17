import { LocationSelection, GeoPoint } from "../models/SearchModel";
import axios from "axios";

const geocodeAddress = async (address: string): Promise<GeoPoint | null> => {
  const res = await axios
    .get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: "json",
        q: address,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Lỗi gọi API geocoding:", err);
    });

  if (res && res.length > 0) {
    return {
      lat: parseFloat(res[0].lat),
      lng: parseFloat(res[0].lon),
    };
  }
  return null;
};

const getCurrentPosition = (): Promise<GeoPoint | null> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Trình duyệt không hỗ trợ định vị."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        reject(new Error("Không lấy được vị trí. Hãy nhập tay hoặc thử lại."));
      }
    );
  });
};

// SEARCH CONTROLLER

const processSearch = async (
  location: LocationSelection
): Promise<LocationSelection> => {
  // Nếu người dùng nhập tay mà chưa có coords → convert
  if (location.coords === null && location.label) {
    try {
      const coords = await geocodeAddress(location.label);
      if (coords) {
        return { ...location, coords };
      } else {
        alert(
          "Không thể tìm thấy vị trí này, hãy thử nhập quận hoặc thành phố bạn đang ở."
        );
        return location;
      }
    } catch (err) {
      alert("Không thể chuyển địa chỉ thành tọa độ!");
      return location;
    }
  }

  return location;
};

//  MODAL CONTROLLER 

const closeModal = (modalId: string): void => {
  const closeButton = document.getElementById(
    `${modalId}Close`
  ) as HTMLButtonElement;
  closeButton?.click();


  
};

export { geocodeAddress, closeModal, getCurrentPosition ,processSearch }