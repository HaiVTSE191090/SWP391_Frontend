import { SignUpRequest } from "../models/SignUpRequest";
import axios from "axios";

// SignUpRequest sign =new SignUpRequest();

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const signUpApi = async (data: SignUpRequest) => {
  const response = await axios.post(`${baseURL}/sign-up`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => err.response.data);
  return response.data;
};

export default signUpApi;
