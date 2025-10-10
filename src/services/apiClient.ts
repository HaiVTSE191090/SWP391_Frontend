import axios from "axios";

// Cấu hình base URL từ env
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  get: async (url: string, params?: any) => {
    const response = await apiClient.get(url, { 
      params, 
      headers: getAuthHeaders() 
    });
    return response.data;
  },

  post: async (url: string, data?: any) => {
    const response = await apiClient.post(url, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  put: async (url: string, data?: any) => {
    const response = await apiClient.put(url, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  delete: async (url: string) => {
    const response = await apiClient.delete(url, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

export default apiClient;
