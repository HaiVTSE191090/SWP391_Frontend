import { useState, useEffect, useCallback } from "react";
import { Station } from "../models/StationModel";
import { LocationSelection } from "../models/SearchModel";
import { getAllStations } from "../services/stationService";


function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface UseStationReturn {
  stations: Station[];
  loading: boolean;
  error: string | null;
  sortedStations: Station[];
  calculateDistance: (location: LocationSelection) => void;
  resetDistance: () => void;
}

export const useStation = (): UseStationReturn => {
  const [stations, setStations] = useState<Station[]>([]);
  const [sortedStations, setSortedStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllStations();
        
        if (response.status === "success" && response.data) {
          setStations(response.data);
          setSortedStations(response.data);
        } else {
          setError(response.message || "Không thể tải danh sách trạm");
        }
      } catch (err) {
        setError("Lỗi khi tải danh sách trạm");
        console.error("Error useStation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);


  const calculateDistance = useCallback((location: LocationSelection) => {
    if (!location?.coords || stations.length === 0) {
      return;
    }

    const stationsWithDistance = stations.map((station) => ({
      ...station,
      distance: haversine(
        location.coords!.lat,
        location.coords!.lng,
        station.latitude,
        station.longitude
      ),
    }));

    const sorted = stationsWithDistance.sort((a, b) => {
      const distA = a.distance ?? Infinity;
      const distB = b.distance ?? Infinity;
      return distA - distB;
    });

    setSortedStations(sorted);
  }, [stations]);

  const resetDistance = useCallback(() => {
    setSortedStations(stations);
  }, [stations]);

  return {
    stations,
    loading,
    error,
    sortedStations,
    calculateDistance,
    resetDistance,
  };
};
