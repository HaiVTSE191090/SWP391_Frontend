import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export async function ocrAPI(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const data = await axios
    .post(baseURL+"/ocr", formData)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return data;
}
