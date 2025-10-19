import api from "./apiClient";
import { KycVerificationRequest, KycVerificationResponse } from "../models/KycModel";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Gửi thông tin KYC (CCCD + GPLX) lên Backend
 */
export const submitKycVerification = async (
  payload: KycVerificationRequest
): Promise<KycVerificationResponse> => {
  try {
    const response = await api.post(`${baseURL}/api/auth/verify`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getKycInfo = async (): Promise<any> => {
  try {
    const response = await api.get(`${baseURL}/api/kyc/info`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * OCR cho CCCD
 */
export const ocrCCCD = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("https://api.fpt.ai/vision/idr/vnm", formData, {
      headers: {
        "api-key": process.env.REACT_APP_OCR_API_KEY || "",
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * OCR cho GPLX
 */
export const ocrGPLX = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("https://api.fpt.ai/vision/dlr/vnm", formData, {
      headers: {
        "api-key": process.env.REACT_APP_OCR_API_KEY || "",
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
