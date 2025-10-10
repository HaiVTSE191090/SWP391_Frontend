import { api } from "./apiClient";

export const getProfile = async () => {
  // GET /api/renter/profile
  return await api.get("/api/renter/profile");
};

export const verifyKyc = async (payload: any) => {
  // POST /api/auth/verify
  return await api.post("/api/auth/verify", payload);
};
