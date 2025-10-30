import axios from "axios";

export async function ocrAPI(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  console.log("API Key:", process.env?.REACT_APP_OCR_API_KEY);

  return await axios.post("https://api.fpt.ai/vision/idr/vnm", formData, {
    headers: {
      "api-key": process.env.REACT_APP_OCR_API_KEY || "",
      "Content-Type": "multipart/form-data",
    },
  });
}
