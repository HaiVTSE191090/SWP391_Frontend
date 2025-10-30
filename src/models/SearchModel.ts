export type GeoPoint = { lat: number; lng: number } | null;

export type LocationSelection = {
  label: string;
  coords: GeoPoint;
};

export type RentalMode = "day";

export type TimeSelection = {
  mode: RentalMode;
  startDate: string;  
  endDate: string;    
  startTime: string;  
  endTime: string;    
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
];

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

export const getTodayDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getDateAfterDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const getDefaultTimeSelection = (): TimeSelection => {
  const sevenDaysLater = getDateAfterDays(7);
  const eightDaysLater = getDateAfterDays(8);
  return {
    mode: "day",
    startDate: sevenDaysLater,
    endDate: eightDaysLater,
    startTime: "09:00",
    endTime: "20:00",
  };
};


export const formatDateDisplay = (dateStr: string): string => {
  return dateStr.split("-").reverse().join("/");
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