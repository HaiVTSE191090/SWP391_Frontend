import { api } from "./apiClient";

export async function ocrAPI(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  // POST /api/ocr với FormData
  return await api.post("/api/ocr", formData);
}
