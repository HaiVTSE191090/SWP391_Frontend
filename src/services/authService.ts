import { SignUpRequest, LoginRequest } from "../models/AuthModel";
import axios from "axios";

// SignUpRequest sign =new SignUpRequest();

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const signUpApi = async (data: SignUpRequest) => {
  const response = await axios
    .post(`${baseURL}/register`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => err.response.data);
  return response.data;
};

const loginApi = async (data: LoginRequest) => {
  try {
    const res = await axios.post(`${baseURL}/login`, data);
    return res.data;
  } catch (err: any) {
    return err.response?.data ;
  }
};

 const loginWithGoogle = async (token: string) => {
  try {
    const res = await axios.post(`${baseURL}/login/google`, { token });
    return res.data;
  } catch (err: any) {
    return err.response?.data;
  }
};

export { signUpApi, loginApi, loginWithGoogle };
