import  * as models from "../models/AuthModel";
import axios from "axios";

// SignUpRequest sign =new SignUpRequest();

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const signUpApi = async (data: models.SignUpRequest) => {
  const response = await axios
    .post(`${baseURL}/register`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => err.response.data);
  return response.data;
};

export const loginApi = async (data: models.LoginRequest) => {
  try {
    const res = await axios.post(`${baseURL}/login`, data);
    return res.data;
  } catch (err: any) {
    return err.response?.data;
  }
};

export const loginWithGoogle = async (token: string) => {
  try {
    const res = await axios.post(`${baseURL}/login/google`, { token });
    return res.data;
  } catch (err: any) {
    return err.response?.data;
  }
};

export const getUserByID = (userID: number) => {

}
