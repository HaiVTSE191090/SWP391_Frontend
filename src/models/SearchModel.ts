export type GeoPoint = { lat: number; lng: number } | null;

export type LocationSelection = {
  label: string;
  coords: GeoPoint;
};

export type RentalMode = "day" | "hour";

export type TimeSelection = {
  mode: RentalMode;
  startDate: string;  // yyyy-mm-dd
  endDate: string;    // yyyy-mm-dd
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
};

export type SearchParams = {
  location: LocationSelection;
  time: TimeSelection;
};

//Defaut values
export const DEFAULT_LOCATION: LocationSelection = {
  label: "TP. Hồ Chí Minh",
  coords: null,
};

export const SUGGESTED_AIRPORTS = [
  "Biên Hòa",
  "Bình Thạnh",
  "Gò Vấp",
  "Bình Chánh",
  "Thủ Đức",
  "Quận 1",
  //lấy API
];

export const getTodayDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getDefaultTimeSelection = (): TimeSelection => ({
  mode: "day",
  startDate: getTodayDate(),
  endDate: getTodayDate(),
  startTime: "09:00",
  endTime: "20:00",
});

// ============= UTILITIES =============
export const formatDateDisplay = (dateStr: string): string => {
  return dateStr.split("-").reverse().join("/"); // dd/mm/yyyy
};

export const formatTimeDisplay = (timeSel: TimeSelection): string => {
  const d = formatDateDisplay;
  if (timeSel.mode === "day") {
    return `${timeSel.startTime}, ${d(timeSel.startDate)} - ${timeSel.endTime}, ${d(
      timeSel.endDate
    )}`;
  }
  return `${timeSel.startTime} - ${timeSel.endTime}, ${d(timeSel.startDate)}`;
};